# Self signed SSL kulcspár létrehozása

## Host gépen (linux)

1. Előfeltételek telepítése

    ```shell
    sudo apt install libnss3-tools wget
    ```

2. [mkcert](https://github.com/FiloSottile/mkcert) telepítése

    ```shell
    MKCERT_VERSION="v1.4.3" &&
    wget "https://github.com/FiloSottile/mkcert/releases/download/${MKCERT_VERSION}/mkcert-${MKCERT_VERSION}-linux-amd64" &&
    sudo cp "mkcert-${MKCERT_VERSION}-linux-amd64" /usr/local/bin/mkcert &&
    sudo chmod +x /usr/local/bin/mkcert &&
    rm -f "mkcert-${MKCERT_VERSION}-linux-amd64"
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
