# Self signed SSL kulcspár létrehozása

Linuxon:

1. [Brew](https://brew.sh/) telepítése

    ```shell
    sudo apt install libnss3-tools linuxbrew-wrapper
    ```

2. [mkcert](https://github.com/FiloSottile/mkcert) telepítése

    ```shell
    brew install mkcert
    ```

3. mkcert által használt root CA telepítése a számítógépre

    ```shell
    ~/brew/bin/mkcert -install
    ```

4. SSL Kulcspár létrehozása a használni kívánt domain-hez

    ```shell
    ~/brew/bin/mkcert osmhu.lan
    ```

5. Kulcspár bemásolása a [development/self-signed-ssl](/development/self-signed-ssl) mappába  
   Az [alapértelmezett apache2 https site config](/development/apache2/osmhu-ssl.conf) ebben a mappában keresi.
