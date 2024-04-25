# Perceptron ile Basit Bir Yapay Sinir Ağı

Bu proje, Python kullanarak basit bir Perceptron yapay sinir ağı modelini oluşturmayı ve eğitmeyi sağlar. Perceptron, girişlerle ağırlıkların lineer bir kombinasyonunu alır ve bir eşik değeri ile karşılaştırarak çıktı üretir.

## Nasıl Kullanılır

1. Python yüklü değilse, [Python'un resmi web sitesinden](https://www.python.org/) indirip yükleyin.
2. Bu projeyi klonlayın:

git clone https://github.com/firatkaanbitmez/yapay-zeka


3. Proje dizinine gidin:

cd ./yapay-zeka/perceptron-öğrenmesi-project


4. `perceptron-learn.py` dosyasını açın ve gerekli değişiklikleri yapın:

    - Eğitim ve test verilerini değiştirin veya kendi verilerinizi ekleyin.
    - Perceptron modelinin parametrelerini isteğe bağlı olarak ayarlayın.
    - Epoch sayısını, öğrenme oranını ve diğer parametreleri değiştirin.
    
5. Terminal veya komut istemcisinde şu komutu çalıştırarak programı başlatın:

python3 perceptron-learn.py


6. İşlem tamamlandığında, eğitim ve test sonuçlarını göreceksiniz.

## Gereksinimler

Bu projeyi çalıştırmak için Python'un yanı sıra `numpy` kütüphanesine de ihtiyacınız olacaktır. Gerekli kütüphaneleri yüklemek için şu komutu kullanabilirsiniz:

pip install numpy