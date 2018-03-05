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

#### Step1: Certificate creation
* Create Apple developer Account
* Add your Account to XCode: Menù: “Xcode” —> “preferences” —>”Account”
* Go to Apple developer Portal to create a developer certificate.
* Go to section “certificates”.Press button “+”. A wizard will guide you in certificate creation.
* Download certificate on your machine. If you already have a public development certificate, in the list double-click on it to download it on your machine.
* Double click to Install certificate
* Go to Apple developer portal to sign up your devices in devices section.
* Go to Identifiers section to create AppId. 
* Go to Provisioning Profiles section to create provisioning profile
* Download the certificate
* In Development machine, Double click on provisioning certificate to install it
  
If you wish to edit the certificate (for example to add more devices), you can edit the provisioning profile in apple developer portal by clicking on it in the certificates list.


#### Step2: Compile Ionic App
* Install ionic: 
    ```sh 
        npm install -g cordova ionic
    ```
* Go to ionic project folder
* Install dependencies: 
    ```sh
        npm install
    ```
* Add ios platform: 
    ```sh
        ionic cordova platform add ios
    ```
* App build:
    ```sh
        ionic cordova build ios
    ```
 

#### Step3: Deploy with Xcode
You can deploy the app directly on the device through xcode on your development machine, or by generating an “.ipa” file to distribute the app on more devices.

##### Direct Deploy
* Go to ionic project folder
* Go to folder platforms/ios/
* Double click on a file with .xcworkspace extension named: <project_name>.xcworkspace
* From Xcode, select project and click on tab general
    * Identity Section: On bundle identifier set the name of appID suffix
    * Signing Section: Deselect “Automatically manage signing”. On signing (debug and Release) set the provisioning profile
* Plug in the device
* Run it pressing the Run button
 

##### Deploy with .ipa file
* Go to ionic project folder
* Go to folder  platforms/ios/
* Double click on a file with .xcworkspace extension named: <project_name>.xcworkspace
* From Xcode, select project and click on tab general
    * Identity Section: On bundle identifier set the name of appID suffix
    * Signing Section: Deselect “Automatically manage signing”. On signing (debug and Release) set the provisioning profile
* From Xcode click on “Product” —>  “Archieve”
* Do an export 
* The “.ipa” file is now generated, and ready to be distributed and installed on the test devices.
* To install using the “.ipa” file:
    * Plug in the device
    * Open Xcode
    * Go to “window” —> “devices and simulator”
    * Select the device
    * On installed app tab press “+”
    * An OpenDialog opens so select the “.ipa” file to install.


