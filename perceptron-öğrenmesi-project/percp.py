import numpy as np

class Perceptron:
    def __init__(self, num_inputs, threshold=0, learning_rate=0.1):
        """
        Perceptron sınıfı oluşturucu fonksiyonu.

        Args:
            num_inputs (int): Giriş özelliklerinin sayısı.
            threshold (float, optional): Eşik değeri. Varsayılan olarak 0.
            learning_rate (float, optional): Öğrenme hızı. Varsayılan olarak 0.1.
        """
        self.threshold = threshold
        self.learning_rate = learning_rate
        self.weights = np.zeros(num_inputs)
        self.bias = 0
    
    def predict(self, inputs):
        """
        Girişleri kullanarak tahmin yapar.

        Args:
            inputs (array): Giriş özelliklerinin dizisi.

        Returns:
            int: Tahmin edilen sınıf.
        """
        activation = np.dot(inputs, self.weights) + self.bias
        return np.where(activation >= self.threshold, 1, 0)
    
    def train(self, training_inputs, labels, epochs):
        """
        Perceptron'u eğitir.

        Args:
            training_inputs (array): Eğitim örneklerinin girişlerinin dizisi.
            labels (array): Eğitim örneklerinin etiketlerinin dizisi.
            epochs (int): Eğitim döngülerinin sayısı.
        """
        for epoch in range(epochs):
            for inputs, label in zip(training_inputs, labels):
                prediction = self.predict(inputs)
                error = label - prediction
                self.weights += self.learning_rate * error * inputs
                self.bias += self.learning_rate * error
            loss = np.mean(np.abs(labels - self.predict(training_inputs)))
            print(f"Epoch {epoch+1}/{epochs} - Loss: {loss} - Weights: {self.weights} - Bias: {self.bias}")

# Eğitim verileri ve etiketleri
training_inputs = np.array([[0,0,1],
                            [0,1,1],
                            [1,0,1],
                            [1,1,1]])
labels = np.array([1, 1, 1, 0])

# Perceptron'u oluştur ve eğit
perceptron = Perceptron(num_inputs=3)
perceptron.train(training_inputs, labels, epochs=10)

# Test
test_inputs = np.array([[1, 0, 0],
                        [0, 1, 0],
                        [1, 0, 0]])
for test_input in test_inputs:
    prediction = perceptron.predict(test_input)
    print(f"Test Girişi: {test_input} - Tahmin: {prediction}")
