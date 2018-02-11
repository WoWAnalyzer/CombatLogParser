# CombatLogParser
A WoW combatlog parser by WoWAnalyzer.

The plan is to make a custom combatlog parser for a WoWAnalyzer Electron app. This allows us the following:

* **Access to player realm.** This allows us to query the battle.net API for race, character images and other interesting information.
* **Access to entire fight.** Not just limited by selected player, allows us to do some more advanced analysis such as a precise Devotion Aura analyzer.
* **Support private logs.** Data would never leave a user's computer when running it locally.
* **Easier to build other tools to analyze logs.** While the WCL API allows some specific apps to function, the restrictions on that API make it impossible to make some other cool apps. By building an open source parser other tools might have an easier time getting started.

# License

To be determined. We'll probably dual-license under AGPL and a license that allows us (WoWAnalyzer) to relicense the code as we deem in the best interest of the organization and its projects as we can imagine not all tools willing to disclose their entire source.

This means when contributing anything to this project you give us permission to relicense it and do with it as we deem fit.

But we promise it will always remain available under at least AGPL, the dual license is just to make more permissive licenses possible.
