from sklearn.neighbors import KNeighborsClassifier
import pickle
import numpy as np
import sys

class_names = {0: 'Normal Weight',
               1: 'Overweight Level I',
               2: 'Overweight Level II',
               3: 'Obesity Type I',
               4: 'Obesity Type II',
               5: 'Obesity Type III'}


array_string = sys.argv[1]
array = []
for item in array_string.split('.'):
    array.append(int(item))


knn = pickle.load(open('./knnpickle_model', 'rb'))
test_array = np.array(array).reshape(1, -1)
knn_predictions = knn.predict(test_array)
print(class_names[knn_predictions[0]])
