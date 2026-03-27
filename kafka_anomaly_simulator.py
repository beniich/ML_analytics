import json
import time
import random
from datetime import datetime
from confluent_kafka import Producer

# Configuration du Producer Kafka
# Note: 'localhost:9092' correspond au port mappé dans votre docker-compose
conf = {
    'bootstrap.servers': 'localhost:9092',
    'client.id': 'ml-anomaly-simulator'
}

producer = Producer(conf)
TOPIC_NAME = 'ml_sensor_data'

def delivery_report(err, msg):
    """ Rapport de livraison après l'envoi d'un message """
    if err is not None:
        print(f'❌ Échec de livraison: {err}')
    else:
        print(f'✅ Message envoyé à {msg.topic()} [{msg.partition()}]')

def generate_sensor_data():
    """ Simule des données de capteurs avec des anomalies occasionnelles """
    base_value = 50.0
    # On ajoute un bruit normal
    value = base_value + random.uniform(-5.0, 5.0)
    
    # 5% de chance de générer une anomalie critique (valeur hors norme)
    is_anomaly = random.random() < 0.05
    if is_anomaly:
        value = value * random.choice([2.5, 0.1]) # Pic ou chute brutale
        
    return {
        'timestamp': datetime.now().isoformat(),
        'sensor_id': 'SENSOR_01',
        'reading': round(value, 2),
        'status': 'CRITICAL' if is_anomaly else 'NORMAL',
        'unit': 'Celsius'
    }

print(f"🚀 Démarrage du simulateur d'anomalies sur le topic: {TOPIC_NAME}")
print("Appuyez sur Ctrl+C pour arrêter.")

try:
    while True:
        data = generate_sensor_data()
        
        # Envoi asynchrone vers Kafka
        producer.produce(
            TOPIC_NAME, 
            key='sensor_01', 
            value=json.dumps(data).encode('utf-8'), 
            callback=delivery_report
        )
        
        # Force l'envoi des messages en attente
        producer.poll(0)
        
        # Pause entre les envois (par ex: 2 secondes)
        time.sleep(2)

except KeyboardInterrupt:
    print("\n🛑 Arrêt du simulateur...")
finally:
    # Attend que tous les messages soient livrés avant de fermer
    producer.flush()
