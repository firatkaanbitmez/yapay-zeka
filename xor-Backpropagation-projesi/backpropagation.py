import numpy as np

# Sigmoid aktivasyon fonksiyonu
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Sigmoid fonksiyonunun türevi
def sigmoid_derivative(x):
    return x * (1 - x)

# Yapay sinir ağı sınıfı
class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        # Ağırlıkların rastgele başlatılması
        self.weights_input_hidden = np.random.uniform(size=(input_size, hidden_size))
        self.weights_hidden_output = np.random.uniform(size=(hidden_size, output_size))
        
        # Bias'ların rastgele başlatılması
        self.bias_hidden = np.random.uniform(size=(1, hidden_size))
        self.bias_output = np.random.uniform(size=(1, output_size))
        
    def feedforward(self, inputs):
        # Giriş katmanından gizli katmana ilerleme
        hidden_inputs = np.dot(inputs, self.weights_input_hidden) + self.bias_hidden
        hidden_outputs = sigmoid(hidden_inputs)
        
        # Gizli katmandan çıkış katmanına ilerleme
        final_inputs = np.dot(hidden_outputs, self.weights_hidden_output) + self.bias_output
        final_outputs = sigmoid(final_inputs)
        
        return final_outputs
    
    def backpropagation(self, inputs, targets, learning_rate):
        # İleri yayılım
        hidden_inputs = np.dot(inputs, self.weights_input_hidden) + self.bias_hidden
        hidden_outputs = sigmoid(hidden_inputs)
        
        final_inputs = np.dot(hidden_outputs, self.weights_hidden_output) + self.bias_output
        final_outputs = sigmoid(final_inputs)
        
        # Hata hesaplama
        output_errors = targets - final_outputs
        
        # Geri yayılım
        output_delta = output_errors * sigmoid_derivative(final_outputs)
        
        hidden_errors = np.dot(output_delta, self.weights_hidden_output.T)
        hidden_delta = hidden_errors * sigmoid_derivative(hidden_outputs)
        
        # Ağırlık ve bias güncellemesi
        self.weights_hidden_output += np.dot(hidden_outputs.T, output_delta) * learning_rate
        self.weights_input_hidden += np.dot(inputs.T, hidden_delta) * learning_rate
        
        self.bias_output += np.sum(output_delta, axis=0) * learning_rate
        self.bias_hidden += np.sum(hidden_delta, axis=0) * learning_rate

# Veri seti
inputs = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
targets = np.array([[0], [1], [1], [0]])

# Yapay sinir ağı oluşturma
input_size = 2
hidden_size = 2
output_size = 1
learning_rate = 0.1

nn = NeuralNetwork(input_size, hidden_size, output_size)

# Eğitim
epochs = 10000
for epoch in range(epochs):
    nn.backpropagation(inputs, targets, learning_rate)
    if epoch % 1000 == 0:
        print(f"Epoch {epoch}: Loss = {np.mean(np.square(targets - nn.feedforward(inputs)))}")

# Test
while True:
    try:
        input_data = input("XOR için iki giriş değeri girin (0 veya 1 arasında, virgülle ayırarak): ")
        input_data = [int(x) for x in input_data.split(",")]
        if len(input_data) != 2 or not all(0 <= x <= 1 for x in input_data):
            raise ValueError
        input_data = np.array(input_data)
        prediction = nn.feedforward(input_data)[0]
        print(f"Tahmin: {prediction}")
    except ValueError:
        print("Geçersiz giriş! Lütfen sadece 0 veya 1 girin ve virgülle ayırın.")
