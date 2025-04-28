# frida-ssl-unpinning-script

## Requirements
- Android device (rooted or with Frida server running in non-root mode)
- [Frida](https://frida.re/) installed on your PC
  ```bash
  pip install frida-tools
  ```
- Frida Server running on the Android device
- USB debugging (ADB) enabled

## Steps to Run SSL Unpinning Script

### 1. Start Frida Server on Android
- Download matching `frida-server` binary for your Android version and CPU architecture.
- Push it to the device:
  ```bash
  adb push frida-server /data/local/tmp/
  adb shell "chmod 755 /data/local/tmp/frida-server"
  adb shell "/data/local/tmp/frida-server &"
  ```
- Or use root:
  ```bash
  adb root
  adb shell "/data/local/tmp/frida-server &"
  ```

### 2. Connect Frida to Device
Check if Frida can detect your device:
```bash
frida-ps -U
```
You should see a list of running processes.

### 3. Find the Target App
List apps:
```bash
frida-ps -Uai
```
Example output:
```
com.example.application
```

### 4. Attach and Run the SSL Unpinning Script
Example command to inject the script:
```bash
frida -U -n com.example.application -l unpin.js
```
Where:
- `-U` = USB device
- `-n` = Target app package name
- `-l` = Your local unpinning JavaScript file

If you want to spawn the app manually:
```bash
frida -U -f com.example.application -l ssl_unpinning.js --no-pause
```

## If Frida fails to attach:
- Kill the app from Android recent apps and try again.
- Confirm Frida versions match between PC and device:
  ```bash
  frida --version
  ```
- Restart Frida server on device.
- Try rebooting device if problem persists.


