from matplotlib import pyplot as plt 
import numpy as np  

# Sigmoid aktivasyon fonksiyonu tanımlanır
def sigmoid(x):
    print(f"{x} için sigmoid hesaplanıyor") 
    return 1 / (1 + np.exp(-x))  

# Sigmoid fonksiyonunun türevidir
def sigmoid_turev(x):
    print(f"{x} için sigmoid türevi hesaplanıyor")  
    return x * (1 - x)  

# Sinir Ağı
class SinirAgi:
    def __init__(self, giris_boyutu, gizli_boyut, cikis_boyutu):
        print(f"Giriş: {giris_boyutu} nöron, Gizli: {gizli_boyut} nöron, Çıkış: {cikis_boyutu} nöron")  # Giriş, gizli ve çıkış nöron sayıları 
        # Ağırlıkları ve biasları rastgele başlat
        self.agirlik_giris_gizli = np.random.uniform(size=(giris_boyutu, gizli_boyut))  
        self.agirlik_gizli_cikis = np.random.uniform(size=(gizli_boyut, cikis_boyutu))         
        self.bias_gizli = np.random.uniform(size=(1, gizli_boyut)) 
        self.bias_cikis = np.random.uniform(size=(1, cikis_boyutu))  

    def ileri(self, inputs):
        print(f"İleri yayılım: {inputs}")  
        gizli_girisler = np.dot(inputs, self.agirlik_giris_gizli) + self.bias_gizli  
        print(f"Gizli katman girişleri: {gizli_girisler}")  
        
        # Gizli katman çıktılarını sigmoid fonksiyonu kullanarak hesapla
        gizli_cikislar = sigmoid(gizli_girisler)  
        print(f"Gizli katman çıktıları: {gizli_cikislar}")  
        
        
        cikis_girislar = np.dot(gizli_cikislar, self.agirlik_gizli_cikis) + self.bias_cikis  
        print(f"Çıkış katman girişleri: {cikis_girislar}")  
        
        # Çıkış katman çıktılarını sigmoid fonksiyonu kullanarak hesapla
        cikis_cikislar = sigmoid(cikis_girislar)  
        print(f"Çıkış katman çıktıları: {cikis_cikislar}")  
        
        return cikis_cikislar  

    def geriye_yayılım(self, inputs, hedefler, ogrenme_oranı):
        print(f"Geriye yayılım: Giriş {inputs}, Hedefler {hedefler}, Öğrenme Oranı {ogrenme_oranı}") 
        # Ağ üzerinden ileri yayılım yap
        gizli_girisler = np.dot(inputs, self.agirlik_giris_gizli) + self.bias_gizli  
        print(f"Gizli katman girişleri: {gizli_girisler}")  
        gizli_cikislar = sigmoid(gizli_girisler)  
        print(f"Gizli katman çıktıları: {gizli_cikislar}")  
        
        cikis_girislar = np.dot(gizli_cikislar, self.agirlik_gizli_cikis) + self.bias_cikis  
        print(f"Çıkış katman girişleri: {cikis_girislar}") 
        cikis_cikislar = sigmoid(cikis_girislar)  
        print(f"Çıkış katman çıktıları: {cikis_cikislar}") 
        
        # Tahmin edilen çıktı ile hedef çıktı arasındaki hatayı hesapla
        hata = hedefler - cikis_cikislar 
        print(f"Hata: {hata}")  
        
        # Çıkış katman çıktılarına göre hatanın türevi
        cikis_delta = hata * sigmoid_turev(cikis_cikislar)  
        print(f"Çıkış delta: {cikis_delta}") 
        
        # Gizli katman çıktıları ile çıkış katman hatası arasındaki hatayı hesaplama
        gizli_hata = np.dot(cikis_delta, self.agirlik_gizli_cikis.T)  
        print(f"Gizli hata: {gizli_hata}")  
        
        # Gizli katman çıktılarına göre hatanın türemini hesapla
        gizli_delta = gizli_hata * sigmoid_turev(gizli_cikislar)  
        print(f"Gizli delta: {gizli_delta}")  
        
        # Ağı geriye yayarak ağırlıkları ve biasları güncelle
        self.agirlik_gizli_cikis += np.dot(gizli_cikislar.T, cikis_delta) * ogrenme_oranı  
        print(f"Güncellenmiş gizli-çıkış ağırlıkları: {self.agirlik_gizli_cikis}")  
        self.agirlik_giris_gizli += np.dot(inputs.T, gizli_delta) * ogrenme_oranı  
        print(f"Güncellenmiş giriş-gizli ağırlıkları: {self.agirlik_giris_gizli}")  
        
        self.bias_cikis += np.sum(cikis_delta, axis=0) * ogrenme_oranı  
        print(f"Güncellenmiş çıkış biası: {self.bias_cikis}")  
        self.bias_gizli += np.sum(gizli_delta, axis=0) * ogrenme_oranı  
        print(f"Güncellenmiş gizli biası: {self.bias_gizli}")  

def main():
    # XOR 
    inputs = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])  
    hedefler = np.array([[0], [1], [1], [0]])  

    giris_boyutu = 2  
    gizli_boyut = 2 
    cikis_boyutu = 1 
    ogrenme_oranı = 0.5  

    # Sinir ağı Eğitimi bilgileri
    sag = SinirAgi(giris_boyutu, gizli_boyut, cikis_boyutu)

    epoch_sayısı = 2000 
    
    losses = []  # Kayıpları depolamak için boş bir liste oluşturulur
    for epoch in range(epoch_sayısı):
        sag.geriye_yayılım(inputs, hedefler, ogrenme_oranı)  # Geriye yayılım gerçekleştirilir
        loss = np.mean(np.square(hedefler - sag.ileri(inputs)))  # Kayıp hesaplanır
        losses.append(loss)  # Kayıp listeye eklenir
        if epoch % 10 == 0:
            print(f"Epoch {epoch}: Kayıp = {loss}")  # Her 10 epoch'ta bir kayıp yazdırılır

    # Kaybı görselleştirir
    plt.plot(losses)  
    plt.xlabel('Epoch')  
    plt.ylabel('Kayıp') 
    plt.title('Eğitim Kaybı')  
    plt.show()  

    # Ağ test
    while True:  
        try:
            
            girdi_verileri = input("XOR için iki giriş değeri girin (0 veya 1, virgülle ayrılmış): ")
            girdi_verileri = [int(x) for x in girdi_verileri.split(",")]  
            if len(girdi_verileri)!= 2 or not all(0 <= x <= 1 for x in girdi_verileri): 
                raise ValueError  
            girdi_verileri = np.array(girdi_verileri)  # Girişler NumPy dizisine dönüştürülür
            
            # Eğitilmiş ağı kullanarak tahmin yapar
            tahmin = sag.ileri(girdi_verileri)[0]  # Ağı ileri yönde çalıştırır ve tahmin yapar
            print(f"Tahmin: {tahmin}")  # Tahmini yazdırır
        except ValueError:
            print("Geçersiz giriş! Lütfen sadece 0,1 gibi girin, virgülle ayrılmış.") 

if __name__ == "__main__":
    main()  
