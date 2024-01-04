# Self signed SSL kulcspár létrehozása

## Ubuntu linux 22.04

1. Előfeltételek telepítése

    ```shell
    sudo apt install libnss3-tools
    ```

2. [mkcert] telepítése

    ```shell
    MKCERT_VERSION="v1.4.4" &&
    curl -JLO "https://dl.filippo.io/mkcert/${MKCERT_VERSION}?for=linux/amd64"
    chmod +x mkcert-v*-linux-amd64
    sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
    ```

3. mkcert által használt root CA telepítése a számítógépre

    ```shell
    mkcert -install
    ```

4. SSL Kulcspár létrehozása a használni kívánt domain-hez

    ```shell
    mkcert osmhu.lan
    ```

5. Kulcspár bemásolása a [development/self-signed-ssl](.) mappába  
    Az [alapértelmezett apache2 https site config](../apache2/osmhu-ssl.conf) ebben a mappában keresi.

[Forrás](https://kifarunix.com/create-locally-trusted-ssl-certificates-with-mkcert-on-ubuntu-20-04/)

[mkcert]:
https://github.com/FiloSottile/mkcert
