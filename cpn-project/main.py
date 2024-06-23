import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.kernel_ridge import KernelRidge
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split

# Fonksiyon tanımı
def fonksiyon(x1, x2):
    return x2 * np.sin(x1) + x1 * np.cos(x2)

# Veri setini oluştur
x1 = np.linspace(0, np.pi, 100)
x2 = np.linspace(0, np.pi, 100)
X1, X2 = np.meshgrid(x1, x2)
Y = fonksiyon(X1, X2)

# Normalizasyon
X1_normalize = (X1 - np.min(X1)) / (np.max(X1) - np.min(X1))
X2_normalize = (X2 - np.min(X2)) / (np.max(X2) - np.min(X2))
Y_normalize = (Y - np.min(Y)) / (np.max(Y) - np.min(Y))

# Veriyi düzleştir ve DataFrame'e çevir
veri = np.vstack((X1_normalize.ravel(), X2_normalize.ravel(), Y_normalize.ravel())).T
df = pd.DataFrame(veri, columns=['x1', 'x2', 'y'])

# Veriyi karıştır
df = df.sample(frac=1).reset_index(drop=True)

# Veriyi eğitim ve test olarak böl (%70 eğitim, %30 test)
egitim_veri, test_veri = train_test_split(df, test_size=0.3, random_state=42)
X_egitim = egitim_veri[['x1', 'x2']].values
y_egitim = egitim_veri['y'].values
X_test = test_veri[['x1', 'x2']].values
y_test = test_veri['y'].values

# RBF modeli eğit
model = KernelRidge(kernel='rbf', gamma=1)
model.fit(X_egitim, y_egitim)

# Tahminleri yap
y_tahmin_egitim = model.predict(X_egitim)
y_tahmin_test = model.predict(X_test)

# Sonuçları grafikte göster
plt.figure(figsize=(12, 6))

# Eğitim seti
plt.subplot(1, 2, 1)
plt.scatter(y_egitim, y_tahmin_egitim, alpha=0.5)
plt.plot([0, 1], [0, 1], 'r--')
plt.xlabel('Gerçek')
plt.ylabel('Tahmin')
plt.title('Eğitim Seti')

# Test seti
plt.subplot(1, 2, 2)
plt.scatter(y_test, y_tahmin_test, alpha=0.5)
plt.plot([0, 1], [0, 1], 'r--')
plt.xlabel('Gerçek')
plt.ylabel('Tahmin')
plt.title('Test Seti')

plt.show()

# Farklı gamma değerleri için işlemi yinele ve sonuçları raporla
def egit_ve_degerlendir(gamma_degerleri):
    sonuclar = []
    for gamma in gamma_degerleri:
        model = KernelRidge(kernel='rbf', gamma=gamma)
        model.fit(X_egitim, y_egitim)
        y_tahmin_egitim = model.predict(X_egitim)
        y_tahmin_test = model.predict(X_test)
        egitim_hatasi = mean_squared_error(y_egitim, y_tahmin_egitim)
        test_hatasi = mean_squared_error(y_test, y_tahmin_test)
        sonuclar.append((gamma, egitim_hatasi, test_hatasi))
    
    return pd.DataFrame(sonuclar, columns=['Gamma', 'Eğitim Hatası', 'Test Hatası'])

# Test edilecek gamma değerleri
gamma_degerleri = np.logspace(-2, 2, 10)
sonuclar_df = egit_ve_degerlendir(gamma_degerleri)
print(sonuclar_df)

# Sonuçları raporla
plt.figure(figsize=(10, 5))
plt.plot(sonuclar_df['Gamma'], sonuclar_df['Eğitim Hatası'], label='Eğitim Hatası', marker='o')
plt.plot(sonuclar_df['Gamma'], sonuclar_df['Test Hatası'], label='Test Hatası', marker='o')
plt.xscale('log')
plt.xlabel('Gamma Değeri')
plt.ylabel('Hata (MSE)')
plt.title('Farklı Gamma Değerleri İçin Eğitim ve Test Hataları')
plt.legend()
plt.show()
