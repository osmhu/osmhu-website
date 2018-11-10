# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  config.vm.box = "ubuntu/bionic64"

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  config.vm.network "forwarded_port", guest: 80, host: 8080

  # Wait x seconds after starting virtual machine
  config.vm.boot_timeout = 300

  # Alias
  config.vm.define "osmhu" do |osmhu|
  end

  # Virtualbox specific configuration
  config.vm.provider :virtualbox do |vb|
    vb.name = "osmhu-development"
    vb.memory = "1024"
    #vb.memory = "4096" # need more RAM when running osm2pgsql (import OSM data into PostgreSQL)
  end

  # Enable provisioning with a shell script
  config.vm.provision "shell", path: "development/vagrant.sh"

  # Sync folders
  config.vm.synced_folder ".", "/vagrant", fsnotify: true
end
