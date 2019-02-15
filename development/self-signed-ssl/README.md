# Self signed SSL kulcspár létrehozása

Linuxon:
1. Brew telepítése
```bash
sudo apt install libnss3-tools linuxbrew-wrapper
```

1. [mkcert](https://github.com/FiloSottile/mkcert) telepítése
```bash
brew install mkcert
```

3. mkcert által használt root CA telepítése a számítógépre
```bash
~/brew/bin/mkcert -install
```

4. SSL Kulcspár létrehozása a használni kívánt domain-hez
```bash
~/brew/bin/mkcert osmhu.lan
```

5. Kulcspár bemásolása a [development/self-signed-ssl](/development/self-signed-ssl) mappába (a mellékelt [apache2 site config](/development/apache2/osmhu-ssl.conf) alapértelmezetten ebben a mappában keresi
