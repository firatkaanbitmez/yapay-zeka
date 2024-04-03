import numpy as np

class Perceptron:
    def __init__(self, num_inputs, agirliklar=None, esik_degeri_sabit=None, ogrenme_orani=0.5, epoch_sayisi=6):
        """
        Perceptron sınıfının başlatıcı metodu.
        
        Args:
        - num_inputs (int): Giriş özelliklerinin sayısı.
        - agirliklar (numpy.ndarray, optional): Ağırlık vektörü. Varsayılan olarak rastgele oluşturulur.
        - esik_degeri_sabit (float, optional): Eşik değeri sabiti. Varsayılan olarak rastgele oluşturulur.
        - ogrenme_orani (float, optional): Öğrenme oranı. Varsayılan değeri 0.5'tir.
        - epoch_sayisi (int, optional): Eğitim döngüsü sayısı. Varsayılan olarak 6'dır.
        """
        self.num_inputs = num_inputs
        if agirliklar is None:
            self.agirliklar = np.random.rand(num_inputs)
        else:
            self.agirliklar = agirliklar
            
        if esik_degeri_sabit is None:
            self.esik_degeri_sabit = np.random.rand()
        else:
            self.esik_degeri_sabit = esik_degeri_sabit
            
        self.ogrenme_orani = ogrenme_orani
        self.epoch_sayisi = epoch_sayisi

    def aktivasyon(self, toplam):
        """
        Aktivasyon fonksiyonu.
        
        Args:
        - toplam (float): Girişlerle ağırlıkların nokta çarpımının toplamı.
        
        Returns:
        - int: Aktivasyon sonucu.
        """
        return 1 if toplam > self.esik_degeri_sabit else 0

    def tahmin(self, girisler):
        """
        Perceptron'un tahmin yapma işlemi.
        
        Args:
        - girisler (numpy.ndarray): Giriş özellikleri.
        
        Returns:
        - int: Tahmin sonucu.
        """
        toplam = np.dot(girisler, self.agirliklar) + self.esik_degeri_sabit
        return self.aktivasyon(toplam)

    def egit(self, egitim_girisleri, etiketler):
        """
        Perceptron'u eğiten metot.
        
        Args:
        - egitim_girisleri (numpy.ndarray): Eğitim veri seti giriş özellikleri.
        - etiketler (numpy.ndarray): Eğitim veri seti etiketleri.
        """
        print("Eğitim başladı...")
        for epoch in range(self.epoch_sayisi):
            print(f"Epoch {epoch + 1}")
            for girisler, etiket in zip(egitim_girisleri, etiketler):
                tahmin = self.tahmin(girisler)
                hata = etiket - tahmin
                self.agirliklar += self.ogrenme_orani * hata * girisler
                self.esik_degeri_sabit += self.ogrenme_orani * hata
                print(f"Girişler: {girisler}, Hedef: {etiket}, Tahmin: {tahmin}, Hata: {hata}")
            print(f"Ağırlıklar: {self.agirliklar}, Eşik Değeri: {self.esik_degeri_sabit}")
        print("Eğitim tamamlandı.")

# Eğitim verileri
egitim_girisleri = np.array([[0, 0, 1],
                            [0, 1, 1],
                            [1, 0, 1],
                            [1, 1, 1]])
etiketler = np.array([1, 1, 1, 0])

# Test verileri
test_girisleri = np.array([[1, 0, 0],
                        [0, 1, 0],
                        [1, 0, 0]])
beklenen_ciktilar = [0, 0, 0]

# Kullanıcıdan ağırlıkları, eşik değeri, öğrenme oranını ve epoch sayısını al
print("Perceptron Modeli Parametrelerini Girin:")
agirliklar = []
for i in range(len(egitim_girisleri[0])):
    agirlik_str = input(f"Ağırlık {i+1} (örn: 0.1): ").strip()
    while not agirlik_str or not all(x.replace('.', '', 1).isdigit() for x in agirlik_str.split(',')):
        print("Geçerli ağırlıklar girmediniz. Lütfen geçerli sayılar girin.")
        agirlik_str = input(f"Ağırlık {i+1} (örn: 0.1): ").strip()
    agirliklar.extend(map(float, agirlik_str.split(',')))

esik_degeri_sabit_str = input("Eşik değeri (örn: 0.5): ").strip()
while not esik_degeri_sabit_str or not esik_degeri_sabit_str.replace('.', '', 1).isdigit():
    print("Geçerli bir eşik değeri girmediniz. Lütfen geçerli bir sayı girin.")
    esik_degeri_sabit_str = input("Eşik değeri (örn: 1): ").strip()
esik_degeri_sabit = float(esik_degeri_sabit_str)

ogrenme_orani_str = input("Öğrenme Oranı (örn: 0.1): ").strip()
while not ogrenme_orani_str or not all(x.replace('.', '', 1).isdigit() for x in ogrenme_orani_str.split(',')):
    print("Geçerli bir öğrenme oranı girmediniz. Lütfen geçerli bir sayı girin.")
    ogrenme_orani_str = input("Öğrenme Oranı (örn: 0.42): ").strip()
ogrenme_orani = float(ogrenme_orani_str)

epoch_sayisi_str = input("Kaç epoch olsun (örn: 100): ").strip()
while not epoch_sayisi_str or not epoch_sayisi_str.isdigit():
    print("Geçerli bir epoch sayısı girmediniz. Lütfen geçerli bir sayı girin.")
    epoch_sayisi_str = input("Kaç epoch olsun (örn: 10): ").strip()

epoch_sayisi = int(epoch_sayisi_str)

# Perceptron modelini başlat ve eğit
perceptron = Perceptron(num_inputs=len(egitim_girisleri[0]), agirliklar=np.array(agirliklar), esik_degeri_sabit=esik_degeri_sabit, ogrenme_orani=ogrenme_orani, epoch_sayisi=epoch_sayisi)
perceptron.egit(egitim_girisleri, etiketler)

# Eğitilmiş perceptron modelini test et
print("\nTest Ediliyor...")
for girisler, beklenen_cikti in zip(test_girisleri, beklenen_ciktilar):
    tahmin = perceptron.tahmin(girisler)
    print(f"Giriş: {girisler}, Beklenen Çıktı: {beklenen_cikti}, Tahmin: {tahmin}")
