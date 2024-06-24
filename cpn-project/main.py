import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error

# Parametreler
def parametreler():
    num_ornek = 1000
    test_boyutu = 0.3
    cluster_radii = [0.05, 0.1, 0.2]
    girdi_boyutu = 2
    cikti_boyutu = 1
    return num_ornek, test_boyutu, cluster_radii, girdi_boyutu, cikti_boyutu

# Adım 1: Veri setini üret ve normalize et
def veri_seti_uret(num_ornek=1000):
    x1 = np.random.uniform(0, np.pi, num_ornek)
    x2 = np.random.uniform(0, np.pi, num_ornek)
    Y = x2 * np.sin(x1) + x1 * np.cos(x2)

    # Veriyi (0, 1) aralığında normalize et
    scaler = MinMaxScaler()
    veri = np.vstack((x1, x2, Y)).T
    normalize_veri = scaler.fit_transform(veri)

    x1_normalize = normalize_veri[:, 0]
    x2_normalize = normalize_veri[:, 1]
    Y_normalize = normalize_veri[:, 2]

    return x1_normalize, x2_normalize, Y_normalize

# Adım 2: Veriyi eğitim ve test setlerine böl
def veriyi_bol(x1_normalize, x2_normalize, Y_normalize, test_boyutu=0.3):
    X = np.vstack((x1_normalize, x2_normalize)).T
    X_egitim, X_test, Y_egitim, Y_test = train_test_split(X, Y_normalize, test_size=test_boyutu, random_state=42)
    return X_egitim, X_test, Y_egitim, Y_test

# Adım 3: Karşılıklı Yayılma Ağı (CPN) modeli tanımla
class CPN:
    def __init__(self, girdi_boyutu, cikti_boyutu, cluster_radius):
        self.girdi_boyutu = girdi_boyutu
        self.cikti_boyutu = cikti_boyutu
        self.cluster_radius = cluster_radius
        self.kohonen_katmani = []
        self.grossberg_katmani = []

    def egit(self, X_egitim, Y_egitim):
        # Kohonen katmanını eğit
        for i, x in enumerate(X_egitim):
            if len(self.kohonen_katmani) == 0:
                self.kohonen_katmani.append(x)
                self.grossberg_katmani.append(Y_egitim[i])
            else:
                mesafeler = np.linalg.norm(np.array(self.kohonen_katmani) - x, axis=1)
                if np.min(mesafeler) > self.cluster_radius:
                    self.kohonen_katmani.append(x)
                    self.grossberg_katmani.append(Y_egitim[i])
                else:
                    kazanan_indeks = np.argmin(mesafeler)
                    self.kohonen_katmani[kazanan_indeks] = (self.kohonen_katmani[kazanan_indeks] + x) / 2
                    self.grossberg_katmani[kazanan_indeks] = (self.grossberg_katmani[kazanan_indeks] + Y_egitim[i]) / 2

    def tahmin_et(self, X_test):
        Y_tahmin = []
        for x in X_test:
            mesafeler = np.linalg.norm(np.array(self.kohonen_katmani) - x, axis=1)
            kazanan_indeks = np.argmin(mesafeler)
            Y_tahmin.append(self.grossberg_katmani[kazanan_indeks])
        return np.array(Y_tahmin)

# Adım 4: Sonuçları görselleştir
def sonuc_gorsellestir(Y_egitim, Y_egitim_tahmin, Y_test, Y_test_tahmin):
    plt.figure(figsize=(14, 6))

    plt.subplot(1, 2, 1)
    plt.scatter(Y_egitim, Y_egitim_tahmin, c='blue', label='Eğitim verisi')
    plt.plot([0, 1], [0, 1], 'r--')
    plt.xlabel('Gerçek')
    plt.ylabel('Tahmin')
    plt.title('Eğitim Verisi')
    plt.legend()

    plt.subplot(1, 2, 2)
    plt.scatter(Y_test, Y_test_tahmin, c='green', label='Test verisi')
    plt.plot([0, 1], [0, 1], 'r--')
    plt.xlabel('Gerçek')
    plt.ylabel('Tahmin')
    plt.title('Test Verisi')
    plt.legend()

    plt.tight_layout()
    plt.show()

# Adım 5: Veri setini üret ve normalize et
num_ornek, test_boyutu, cluster_radii, girdi_boyutu, cikti_boyutu = parametreler()
x1_normalize, x2_normalize, Y_normalize = veri_seti_uret(num_ornek)

# Adım 6: Veriyi eğitim ve test setlerine böl
X_egitim, X_test, Y_egitim, Y_test = veriyi_bol(x1_normalize, x2_normalize, Y_normalize, test_boyutu)

# Adım 7: CPN modelini eğit
cpn = CPN(girdi_boyutu=girdi_boyutu, cikti_boyutu=cikti_boyutu, cluster_radius=0.1)
cpn.egit(X_egitim, Y_egitim)

# Adım 8: Tahmin yap ve sonuçları görselleştir
Y_egitim_tahmin = cpn.tahmin_et(X_egitim)
Y_test_tahmin = cpn.tahmin_et(X_test)
sonuc_gorsellestir(Y_egitim, Y_egitim_tahmin, Y_test, Y_test_tahmin)

# Adım 9: Farklı yarıçap ve kural sayıları ile süreci yinele ve sonuç raporu hazırla
def farkli_parametreler_ile_yinele(cluster_radii):
    sonuclar = []

    for radius in cluster_radii:
        cpn = CPN(girdi_boyutu=girdi_boyutu, cikti_boyutu=cikti_boyutu, cluster_radius=radius)
        cpn.egit(X_egitim, Y_egitim)
        Y_test_tahmin = cpn.tahmin_et(X_test)
        mse = mean_squared_error(Y_test, Y_test_tahmin)
        sonuclar.append((radius, mse))

    for sonuc in sonuclar:
        print(f"Küme Yarıçapı: {sonuc[0]}, MSE: {sonuc[1]}")

farkli_parametreler_ile_yinele(cluster_radii)
