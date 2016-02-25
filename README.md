# adminsys-da2i-projet_final
## Projet Final d'Administration Système (Licence DA2I)
### Edouard CATTEZ

---------------------

[Sujet du projet](http://moodle.univ-lille1.fr/pluginfile.php/214032/mod_resource/content/1/projet-final.txt)

# Table des matières

- Caractéristiques des machines
  - Caractéristiques générales
  - Caractéristiques détaillées
- Le serveur
  - Exemple du fichier /etc/network/interfaces
  - Exemple du fichier /etc/hosts
  - Bind9
      - Installation par les paquets
      - Configuration des adresses IP DNS
      - Configuration des '(reverse) zones'
      - Edition du fichier /etc/bind/zones/db.da2i.org
      - Edition du fichier /etc/bind/zones/db.192
      - Vérification des zones saisies
      - Edition du fichier /etc/resolv.conf
      - Vérification de la configuration
  - LDAP

# Caractéristiques des machines

## Caractéristiques générales

- **Taille de disque** : 10Go
- **Netmask** : 255.255.255.0
- **Gateway** : 192.168.194.2
- **Nom de domaine** : da2i.org
- **Bind9** : oui
- **SSH** : oui
- **Accès par LDAP** : oui
- **Utilisateurs** : root, bernard, georges, robert
- **Mot de passe** : login utilisateur

## Caractéristiques détaillées

|  .  | **Serveur** | **Debian** | **ArchLinux** | **FreeBSD** |
| :-- | :---------- | :--------- | :------------ | :---------- |
| **Adresse IP** | 192.168.194.*10* | 192.168.194.*20* | 192.168.194.*30* | 192.168.194.*40* |
| **Nom d'accès** | *serveur*.da2i.org | *debian*.da2i.org | *archlinux*.da2i.org | *freebsd*.da2i.org |
| **Interface Graphique** | mode texte | gnome 800x600 | deepin 800x600 | xfce 800x600 |

# Le serveur

## Exemple du fichier /etc/network/interfaces

```
auto eth0
iface eth0 inet static
	address 192.168.194.10
	netmask 255.255.255.0
	gateway 192.168.194.2
```

Afin que les modifications du fichier soient appliquées, il faut exécuter la commande suivante : `/etc/init.d/networking restart`

## Exemple du fichier /etc/hosts

```
127.0.0.1		localhost
127.0.1.1		serveur.da2i.org	serveur
192.168.194.10	serveur.da2i.org
```

Afin que les modifications du fichier soient appliquées, il faut exécuter la commande suivante : `/etc/init.d/networking restart`

## Bind9

### Installation par les paquets

```
apt-get install bind9
```

### Configuration des adresses IP DNS

```
nano /etc/bind/named.conf.options
```
```
	forwarders {
		192.168.194.2;
		172.18.48.31;
	}
	
	dnssec-validation no;
```

### Configuration des '(reverse) zones'

On édite ce fichier pour associer chaque adresse IP a un nom de domaine, ou inversement

```
nano /etc/bind/named.conf.local
```
```
	zone "da2i.org" {
		type master;
		file "/etc/bind/zones/db.da2i.org";
	};
	
	zone "192.168.194.in-addr.arpa" {
		type master;
		file "/etc/bind/zones/db.192";
	};
```
```
mkdir /etc/bind/zones
cp /etc/bind/db.local /etc/bind/zones/db.da2i.org
cp /etc/bind/db.127 /etc/bind/zones/db.192
```

### Edition du fichier /etc/bind/zones/db.da2i.org

```
nano /etc/bind/zones/db.da2i.org
```
```
;
; BIND data file for local loopback interface
;
$TTL    604800
@       IN      SOA     server.da2i.org. webuser.da2i.org. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
da2i.org.       IN      NS      server.da2i.org.
da2i.org.       IN      A       192.168.194.10
;@      IN      NS      localhost.
;@      IN      A       127.0.0.1
;@      IN      AAAA    ::1
server  IN      A       192.168.194.10
gateway IN      A       192.168.194.2
debian  IN      A       192.168.194.20
archlinux       IN      A       192.168.194.30
freebsd IN      A       192.168.194.40
www     IN      CNAME   da2i.org.
```

### Edition du fichier /etc/bind/zones/db.192

```
nano /etc/bind/zones/db.192
```
```
;
; BIND reverse data file for local loopback interface
;
$TTL    604800
@       IN      SOA     server.da2i.org. webuser.da2i.org. (
                              1         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
;@      IN      NS      localhost.
;1.0.0  IN      PTR     localhost.
        IN      NS      server.
2       IN      PTR     gateway.da2i.org.
10      IN      PTR     server.da2i.org.
20      IN      PTR     debian.da2i.org.
30      IN      PTR     archlinux.da2i.org.
40      IN      PTR     freebsd.da2i.org.
```

### Vérification des zones saisies

```
named-checkzone da2i.org /etc/bind/zones/db.da2i.org

zone da2i.org/IN: loaded serial 2
OK
```

```
named-checkzone da2i.org /etc/bind/zones/db.192

zone da2i.org/IN: loaded serial 1
OK
```

### Edition du fichier /etc/resolv.conf

```
nano /etc/resolv.conf
```
```
domain da2i.org
search da2i.org
nameserver 192.168.194.10
```

Enfin, on redémarre le service bind9 via la commande suivante : `/etc/init.d/bind9 restart`

### Vérification de la configuration

```
host -l da2i.org
```
```
da2i.org name server server.da2i.org.
da2i.org has address 192.168.194.10
archlinux.da2i.org has address 192.168.194.30
debian.da2i.org has address 192.168.194.20
freebsd.da2i.org has address 192.168.194.40
gateway.da2i.org has address 192.168.194.2
server.da2i.org has address 192.168.194.10
```

## LDAP

### Installation par les paquets

```
apt-get install sladp ldap-utils
```
