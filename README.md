# adminsys-da2i-projet_final
## Projet Final d'Administration Système (Licence DA2I)
### Edouard CATTEZ

---------------------

[Sujet du projet](http://moodle.univ-lille1.fr/pluginfile.php/214032/mod_resource/content/1/projet-final.txt)

# Table des matières

- [Caractéristiques des machines]()
  - [Caractéristiques générales]()
  - [Exemple des fichiers]()
  - [Caractéristiques détaillées]()
  - [Programmes clients]()
- [Le serveur]()
  - [Bind9]()
      - [Installation par les paquets]()
      - [Configuration des adresses IP DNS]()
      - [Configuration des '(reverse) zones']()
      - [Edition du fichier /etc/bind/zones/db.da2i.org]()
      - [Edition du fichier /etc/bind/zones/db.192]()
      - [Vérification des zones saisies]()
      - [Edition du fichier /etc/resolv.conf]()
      - [Vérification de la configuration]()
  - [LDAP]()
      - [Installation par les paquets]()
      - [Configuration du serveur LDAP]()
          - [Configuration des accès]()
          - [Configuration de l'indexage]()
          - [Vérification de la configuration]()
      - [Création de l'arbre LDAP]()
      - [Ajout d'utilisateurs]()
          - [Exemple avec l'utilisateur bernard]()
  - [Serveur NFS]()
      - [Installation par les paquets]()
      - [Configuration du point de montage]()
- [Les clients]()
  - [Client Debian]()
      - [Montage NFS]()
          - [Installation par les paquets]()
          - [Configuration du PAM]()
      - [Configuration du fstab]()
- [Sources]()
      

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

Les modifications du réseau et de nom de domaine se font dans les fichiers **/etc/network/interfaces** et **/etc/hosts des machines**.
Notons que nous allons utiliser Bind9 pour associer les noms des machines à leur IP.

### Exemple des fichiers

- /etc/network/interfaces

    ```
    auto eth0
    iface eth0 inet static
	    address 192.168.194.10
	    netmask 255.255.255.0
	    gateway 192.168.194.2
	    dns-nameservers 192.168.194.10
    ```

- /etc/hosts

    ```
    #127.0.0.1		localhost
    127.0.1.1		serveur.da2i.org	serveur
    192.168.194.10	serveur.da2i.org
    ```

## Caractéristiques détaillées

|  .  | **Serveur** | **Debian** | **ArchLinux** | **FreeBSD** |
| :-- | :---------- | :--------- | :------------ | :---------- |
| **Adresse IP** | 192.168.194.*10* | 192.168.194.*20* | 192.168.194.*30* | 192.168.194.*40* |
| **Nom d'accès** | *serveur*.da2i.org | *debian*.da2i.org | *archlinux*.da2i.org | *freebsd*.da2i.org |
| **Interface Graphique** | mode texte | xfce 800x600 | deepin 800x600 | xfce 800x600 |
| **Etat** | done | done | doing | to do |

Afin que les modifications des fichier soient appliquées, il faut exécuter la commande suivante : `/etc/init.d/networking restart`

## Programmes clients

Les 3 clients doivent offrir une interface graphique et des outils
bureautiques de base accessibles en français, anglais et en néerlandais :

   * traitement de texte et tableur via libreoffice

   * navigateur web via firefox

   * outil de gestion de mail via thunderbird

L'installation de ces outils se fait avec les commandes ci-après :

```
apt-get install iceweasel
apt-get install icedove
apt-get install libreoffice
```

---------------------

# Le serveur

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
@       IN      SOA     serveur.da2i.org. webuser.da2i.org. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
da2i.org.       IN      NS      serveur.da2i.org.
da2i.org.       IN      A       192.168.194.10
;@      IN      NS      localhost.
;@      IN      A       127.0.0.1
;@      IN      AAAA    ::1
serveur  IN      A       192.168.194.10
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
@       IN      SOA     serveur.da2i.org. webuser.da2i.org. (
                              1         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
;@      IN      NS      localhost.
;1.0.0  IN      PTR     localhost.
        IN      NS      serveur.
2       IN      PTR     gateway.da2i.org.
10      IN      PTR     serveur.da2i.org.
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
da2i.org name serveur serveur.da2i.org.
da2i.org has address 192.168.194.10
archlinux.da2i.org has address 192.168.194.30
debian.da2i.org has address 192.168.194.20
freebsd.da2i.org has address 192.168.194.40
gateway.da2i.org has address 192.168.194.2
serveur.da2i.org has address 192.168.194.10
```

## LDAP

### Installation par les paquets

```
apt-get install slapd ldap-utils
```

### Configuration du serveur LDAP

On commence par définir la base et l'uri du LDAP.

```
nano /etc/ldap/ldap.conf
```
```
#
# LDAP Defaults
#

# See ldap.conf(5) for details
# This file should be world readable but not world writable.

#BASE   dc=example,dc=com
#URI    ldap://ldap.example.com ldap://ldap-master.example.com:666

BASE dc=da2i, dc=org
URI ldap://192.168.194.10/

#SIZELIMIT      12
#TIMELIMIT      15
#DEREF          never

# TLS certificates (needed for GnuTLS)
TLS_CACERT      /etc/ssl/certs/ca-certificates.crt
```

Puis on reconfigure l'ensemble.

```
dpkg-reconfigure slapd

Omit OpenLDAP server configuration? No
DNS domain name: da2i.org
Organization name? da2i.org
Administrator password: root
Confirm password: root
Database backend to use: HDB
Do you want the database to be removed when slapd is purged? No
Allow LDAPv2 protocol? No
```

#### Configuration des accès

```
ldapadd -c -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/core.ldif
ldapadd -c -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/cosine.ldif
ldapadd -c -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/nis.ldif
ldapadd -c -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/inetorgperson.ldif
```
```
echo "
dn: cn=config
changetype: modify
replace: olcLogLevel
olcLogLevel: 256
" > /var/tmp/loglevel.ldif
```
```
ldapmodify -Y EXTERNAL -H ldapi:/// -f /var/tmp/loglevel.ldif
```

#### Configuration de l'indexage

```
echo "
dn: olcDatabase={1}hdb,cn=config
changetype: modify
add: olcDbIndex
olcDbIndex: uid eq
" > /var/tmp/uid_eq.ldif
```
```
ldapmodify -Y EXTERNAL -H ldapi:/// -f /var/tmp/uid_eq.ldif
```

#### Vérification de la configuration

```
ldapsearch -x
```
```
# extended LDIF
#
# LDAPv3
# base <dc=da2i, dc=org> (default) with scope subtree
# filter: (objectclass=*)
# requesting: ALL
#

# da2i.org
dn: dc=da2i,dc=org
objectClass: top
objectClass: dcObject
objectClass: organization
o: da2i.org
dc: da2i

# admin, da2i.org
dn: cn=admin,dc=da2i,dc=org
objectClass: simpleSecurityObject
objectClass: organizationalRole
cn: admin
description: LDAP administrator

# search result
search: 2
result: 0 Success

# numResponses: 3
# numEntries: 2
```

### Création de l'arbre LDAP

On crée deux objets, **users** et **groups** qui feront offices respectivement de **/etc/passwd** et **/etc/group**.
Ces deux objets auront pour objectClass **organizationalUnit** et seront préparés par l'intermédiaire d'un fichier temporaire.

```
nano /var/tmp/ou.ldif
```
```
dn: ou=users,dc=da2i,dc=org
ou: users
objectClass: organizationalUnit

dn: ou=groupes,dc=da2i,dc=org
ou: groupes
objectClass: organizationalUnit
```

Après avoir préalablement éteint le serveur ldap avec la commande `invoke-rc.d slapd stop`, on ajoute le contenu du fichier temporaire à l'arbre LDAP.

```
slapadd -c -v -l /var/tmp/ou.ldif
```

Après avoir redémarré le serveur ldap avec la commande `invoke-rc.d slapd start`, on effectue une recherche sur ces nouveaux organizationalUnit pour vérifier notre configuration.

```
ldapsearch -x
```
```
# extended LDIF
#
# LDAPv3
# base <dc=da2i, dc=org> (default) with scope subtree
# filter: (objectclass=*)
# requesting: ALL
#

# da2i.org
dn: dc=da2i,dc=org
objectClass: top
objectClass: dcObject
objectClass: organization
o: da2i.org
dc: da2i

# admin, da2i.org
dn: cn=admin,dc=da2i,dc=org
objectClass: simpleSecurityObject
objectClass: organizationalRole
cn: admin
description: LDAP administrator

# users, da2i.org
dn: ou=users,dc=da2i,dc=org
ou: users
objectClass: organizationalUnit

# groups, da2i.org
dn: ou=groups,dc=da2i,dc=org
ou: groups
objectClass: organizationalUnit

# search result
search: 2
result: 0 Success

# numResponses: 5
# numEntries: 4
```

### Ajout d'utilisateurs

Nous allons maintenant créer nos 3 utilisateurs bernard, georges et robert et les ajouter à l'arbre du LDAP.
Ces utilisateurs seront créés par l'intermédiaire de 3 fichiers, respectivement /var/tmp/bernard.ldif, /var/tmp/georges.ldif et /var/tmp/robert.ldif.

N'oublions pas non plus d'éteindre le serveur avant toute opération : `invoke-rc.d slapd stop`.

#### Exemple avec l'utilisateur bernard

- Ajout de l'utilisateur

```
nano /var/tmp/bernard.ldif
```
```
dn: cn=bernard,ou=groups,dc=da2i,dc=org
cn: bernard
gidNumber: 1001
objectClass: top
objectClass: posixGroup

dn: uid=bernard,ou=users,dc=da2i,dc=org
uid: bernard
uidNumber: 1001
gidNumber: 1001
cn: bernard
sn: bernard
objectClass: top
objectClass: person
objectClass: posixAccount
objectClass: shadowAccount
loginShell: /bin/bash
homeDirectory: /home/bernard
```
```
ldapadd -c -x -D cn=admin,dc=da2i,dc=org -W -f /var/tmp/bernard.ldif
```

- Modification du mot de passe

```
ldappasswd -x -D cn=admin,dc=da2i,dc=org -W -S uid=bernard,ou=users,dc=da2i,dc=org
```

- Vérification de l'ajout

```
ldapsearch -x uid=bernard
```

On effectue enfin les mêmes opérations pour georges et robert.

## Serveur NFS

### Installation par les paquets

```
apt-get install nfs-kernel-server
```

### Configuration du point de montage

```
mkdir /srv/home
mkdir /srv/home/bernard
mkdir /srv/home/georges
mkdir /srv/home/robert 
chmod go+rwx /srv/home/bernard
chmod go+rwx /srv/home/georges
chmod go+rwx /srv/home/robert
```
```
nano /etc/exports
```
```
/srv/home *.da2i.org(rw,sync,no_subtree_check)
```

Une fois la configuration terminée, on démarre le serveur nfs via la commande `/etc/init.d/nfs-kernel-server start`.

---------------------

# Les clients

## Client Debian

### Montage NFS

#### Installation par les paquets

```
apt-get install libnss-ldap libpam-ldap nscd

dpkg-reconfigure libnss-ldap
dpkg-reconfigure libpam-ldap
```
```
LDAP server URI: ldap://192.168.194.10/
Distinguished name of the search base: dc=da2i,dc=org
LDAP version to use: 3
Does the LDAP database require login? No
Special LDAP privileges for root? No
Make the configuration file readable/writable by its owner only? No
Allow LDAP admin account to behave like local root? Yes
Make local root Database admin. No
Does the LDAP database require login? No
LDAP administrative account: cn=admin,dc=da2i,dc=org
LDAP administrative password: <PASSWORD>
DLocal crypt to use when changing passwords. md5
```

```
nano /etc/nsswitch.conf
```
```
passwd:         files ldap
group:          files ldap
```

Après avoir préalablement éteint NSCD via la commande `invoke-rc.d nscd stop`, on vérifie l'existence de l'utilisateur bernard

```
id bernard
uid=1001(bernard) gid=1001(bernard) groupes=1001(bernard)
```

#### Configuration du PAM

Nous allons à présent configurer le PAM afin que les identifiants du LDAP soient demandés à l'accueil de la machine.

- /etc/pam.d/common-account

```
account [success=2 new_authtok_reqd=done default=ignore]        pam_unix.so
account [success=1 default=ignore]      pam_ldap.so

account requisite                       pam_deny.so

account required                        pam_permit.so
```

- /etc/pam.d/common-auth

```
auth    [success=2 default=ignore]      pam_unix.so nullok_secure
auth    [success=1 default=ignore]      pam_ldap.so use_first_pass

auth    requisite                       pam_deny.so

auth    required                        pam_permit.so
```

- /etc/pam.d/common-password

```
password        [success=2 default=ignore]      pam_unix.so obscure sha512
password        [success=1 user_unknown=ignore default=die]     pam_ldap.so use_authtok try_first_pass

password        requisite                       pam_deny.so

password        required                        pam_permit.so
```

- /etc/pam.d/common-session

```
session [default=1]                     pam_permit.so

session requisite                       pam_deny.so

session required                        pam_permit.so

session required        pam_unix.so
```

### Configuration du fstab

Afin d'associer le répertoire utilisateur du serveur au répertoire du client, on édite le fichier /etc/fstab.

```
192.168.194.10:/srv/home        /home   nfs4    auto    0       0
```

Attention, il se peut qu'une ligne comme ci-après existe. Si tel est le cas, il faut la commenter.

```
UUID=dd3a0110-1482-4592-8c95-3ba3ebfb8e84 /home           btrfs   defaults    $
```

On peut maintenant redémarrer la machine avec la commande `reboot`.

## Sources

- Bind9
  - https://wiki.debian.org/fr/Bind9
  - https://doc.ubuntu-fr.org/bind9
- LDAP
  - http://uid.free.fr/Ldap/ldap.html
  - http://www.tecmint.com/install-openldap-server-and-administer-with-phpldapadmin-in-debianubuntu/
  - http://www.ghacks.net/2010/09/03/modify-ldap-entries-with-the-ldapmodify-command/
- ArchLinux
  - https://wiki.archlinux.fr/Installation
  - http://fredbezies.developpez.com/tutoriels/linux/installation-archlinux/
- Xfce
  - https://wiki.debian.org/fr/Xfce#Installation_d.27un_nouveau_syst.2BAOg-me_avec_Xfce
