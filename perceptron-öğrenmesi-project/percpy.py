import numpy as np

class Perceptron:
    def __init__(self, num_inputs, agirliklar=None, esik_degeri_sabit=None, ogrenme_orani=0.5, epoch_sayisi=6):
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
        return 1 if toplam > self.esik_degeri_sabit else 0

    def tahmin(self, girisler):
        toplam = np.dot(girisler, self.agirliklar) + self.esik_degeri_sabit
        return self.aktivasyon(toplam)

    def egit(self, egitim_girisleri, etiketler):
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

# Kullanıcıdan ağırlıkları, eşik değeri ve epoch sayısını al
agirliklar = np.array([float(input(f"Ağırlık {i+1}: ")) for i in range(len(egitim_girisleri[0]))])
esik_degeri_sabit = float(input("Eşik değeri: "))
epoch_sayisi = int(input("Kaç epoch olsun: "))

# Perceptron modelini başlat ve eğit
perceptron = Perceptron(num_inputs=len(egitim_girisleri[0]), agirliklar=agirliklar, esik_degeri_sabit=esik_degeri_sabit, epoch_sayisi=epoch_sayisi)
perceptron.egit(egitim_girisleri, etiketler)

# Eğitilmiş perceptron modelini test et
print("\nTest ediliyor...")
for girisler, beklenen_cikti in zip(test_girisleri, beklenen_ciktilar):
    tahmin = perceptron.tahmin(girisler)
    print(f"Giriş: {girisler}, Beklenen Çıktı: {beklenen_cikti}, Tahmin: {tahmin}")
