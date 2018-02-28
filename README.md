# Cagliari Port 2020 - Tour Planner Mobile App #

In questo documento vengono riportati i passi necessari per il setup dell'applicazione per smartphones Tour Planner.

Il progetto è basato sul framework [Ionic 2](http://ionicframework.com/docs/v2/) che permette di sviluppare applicazioni ibride valevoli per sistemi Android e iOS.
(N.B.: il **2** di _tourplanner2_ significa che si sta utilizzando **Ionic 2**)

### Requisiti ###
* NodeJs >= v5.0.0 - (Consigliato utilizzare [NVM](https://github.com/creationix/nvm) per la gestione delle versioni di NodeJS)


### Ionic ###

Installare Ionic framework come pacchetto NPM ([Installation](http://ionicframework.com/docs/v2/getting-started/installation/))
```sh
  $ npm install -g ionic
```
Se necessario installare le dipendenze richieste (cordova, ios-sim, ios-deploy)

Installare typings per il modulo PouchDB
```sh
  $ npm install typings --global
```

### Installazione del progetto ###

I comandi seguenti servono per la prima configurazione in locale del progetto.
```sh
  $ git clone https://gitlab.com/cp2020/tourplanner.git
  $ cd tourplanner
  $ npm install
  $ typings install
  $ ionic serve -c
```
Il comando ` ionic serve ` apre una finestra sul browser che simula il comportamento dell'app come web-app.

### Run su device ###


Aggiungere la platform desiderata al progetto
```sh
  $ ionic platform add ios
  $ ionic platform add android
```

### Compilazione e build del progetto ANDROID ###

collegare il dispositivo al computer


recuperare l'id-vendor e l'id-product del modello del dispsoitivo dove si vuole fare la build attraverso il comando ` lsusb`, che visualizzarà l'ID del dispositivo collegato al computer, l'id-vendor è la prima parte del ID e id-product la seconda

aggiungere l'id-vendor e opzionalmente l'id-product  del modello del dispositivo nel file ` /etc/udev/rules.d/51-android.rules `

riavvio del servizio

```sh
  $ service udev restart
```

aggiungere le variabile di ambiente ` HOME_ANDROID ` e ` PATH`  nel file ` ~/.bashrc` , es:

```sh
  export ANDROID_HOME=/home/linux/Android/Sdk
  export PATH=$PATH:$ANDROID_HOME/tools
  export PATH=$PATH:$ANDROID_HOME/platform-tools
```





avviare la build sul device

```sh
  $ sudo ANDROID_HOME=/home/linux/Android/Sdk ionic cordova run android --device
```

in questo caso le variabili di ambiente sono settate nella chiamata, il risultato sarà l'avviamento della app direttamente sul dispositivo. Il comando run esgue anche la build.


### Requisiti per installazione su Android ###
I seguenti requisiti sono richiesti da Ionic per il deploy del progetto su Android (testati al 20/09/2016)


# JAVA
* java 1.7 (da testare con java 8 e java 9)

# Android SDK
* Android SDK 6.0 api level 23
* Android SDK Build-tools 23.0.3 e non 24.x (Errore: Unsupported major.minor version 52.0)
* Android SDK Platform-tools 24.0.3
* Extras:
 * Android Support Repository
 * Google Play Services 32
 * Google Repository 
 * Intel x86 Emulator Accellerator (per emulazione) 6.0.3

### Compilazione e build del progetto IOS ###

```sh
  $ ionic build ios
 
```

Run dell'applicazione (se un dispositivo fisico è connesso al computer l'app verrà installata direttamente nello smartphone)


```sh
  $ ionic run ios
  
```