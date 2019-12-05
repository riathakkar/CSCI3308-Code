
#define PIN_ANALOG_IN A0


double readCount=0; 
double pin_value_total;
unsigned long previousMillis = 0;        // will store last time LED was updated

// constants won't change:
const long interval = 500;           // interval at which to grab data


void setup() {
  // put your setup code here, to run once:
    Serial.begin(9600);
}

void loop() {
  unsigned long currentMillis = millis();
  readCount++; //increment read count
  pin_value_total = pin_value_total + analogRead(PIN_ANALOG_IN); //add to avg to divide by later
  if (currentMillis - previousMillis >= interval) { //check for 60s interval
    // save the last time you blinked the LED
    previousMillis = currentMillis;
   
    double avg = pin_value_total/readCount;
    float inDB = avg*3.13;//1.83*avg - 5.3; //linear db conversion (definitely not ideal)
    Serial.println(inDB);
    readCount = 0; //reset
    pin_value_total = 0; //reset
  }
}
