// This is the Debian specific preferences file for Iceweasel
// You can make any change in here, it is the purpose of this file.
// You can, with this file and all files present in the
// /etc/iceweasel/pref directory, override any preference that is
// present in /usr/lib/iceweasel/defaults/preferences directory.
// While your changes will be kept on upgrade if you modify files in
// /etc/iceweasel/pref, please note that they won't be kept if you
// do make your changes in /usr/lib/iceweasel/defaults/preferences.
//
// Note that lockPref is allowed in these preferences files if you
// don't want users to be able to override some preferences.

pref("extensions.update.enabled", true);

// Use LANG environment variable to choose locale
pref("intl.locale.matchOS", true);
pref("general.useragent.locale", "chrome://global/locale/intl.properties");

// Default to en-US searchplugins when locale's aren't found
pref("distribution.searchplugins.defaultLocale", "en-US");

// Disable default browser checking.
pref("browser.shell.checkDefaultBrowser", false);

// Avoid openh264 being downloaded.
pref("media.gmp-manager.url.override", "data:text/plain,");

// Disable openh264.
pref("media.gmp-gmpopenh264.enabled", false);

// Default to classic view for about:newtab
sticky_pref("browser.newtabpage.enhanced", false);
