# Twitch TTS Bot (currently MacOS/Linux)
Twitch bot that handles chat text-to-speech, using the `Say` library, and the `TmiJS` module.

## Installation / setup
- Clone repo
- Create `config.json` in root folder (see below: Bot Config)
- Run `npm install` to install modules
- Start bot by running `npm run start` in the root folder

## Bot Config
`config.json` structure:
```
{
  identity: {
    username: "<Bot Username>",
    password: "<Bot OAuth Token"
  },
  channels: ["<Channel Name>", ...]
}
```

## Bot Commands (not including shortcuts)
>!help

## Set voice
>!voice [speaker|locale] [speed]

For example:
>!voice Damayanti

or

>!voice bad_news 0.69

## Get current voice
>!currentvoice

## Set a random voice
>!randomvoice

# List of Available Voices
>!voices

- Agnes (en_US)
- Albert (en_US)
- Alex (en_US)
- Alice (it_IT)
- Alva (sv_SE)
- Amelie (fr_CA)
- Anna (de_DE)
- Bad_News (en_US)
- Bahh (en_US)
- Bells (en_US)
- Boing (en_US)
- Bruce (en_US)
- Bubbles (en_US)
- Carmit (he_IL)
- Cellos (en_US)
- Claire (nl_NL)
- Damayanti (id_ID)
- Daniel (en_GB)
- Deranged (en_US)
- Diego (es_AR)
- Ellen (nl_BE)
- Felipe (pt_BR)
- Fiona (en-scotland)
- Fred (en_US)
- Good_News (en_US)
- Hysterical (en_US)
- Ioana (ro_RO)
- Joana (pt_PT)
- Jorge (es_ES)
- Juan (es_MX)
- Junior (en_US)
- Kanya (th_TH)
- Karen (en_AU)
- Kate (en_GB)
- Kathy (en_US)
- Kyoko (ja_JP)
- Laura (sk_SK)
- Lee (en_AU)
- Lekha (hi_IN)
- Luca (it_IT)
- Luciana (pt_BR)
- Maged (ar_SA)
- Mariska (hu_HU)
- Markus (de_DE)
- Mei-Jia (zh_TW)
- Melina (el_GR)
- Milena (ru_RU)
- Moira (en_IE)
- Monica (es_ES)
- Nora (nb_NO)
- Oliver (en_GB)
- Paulina (es_MX)
- Princess (en_US)
- Ralph (en_US)
- Rishi (en_IN)
- Samantha (en_US)
- Sara (da_DK)
- Satu (fi_FI)
- Serena (en_GB)
- Sin-ji (zh_HK)
- Tessa (en_ZA)
- Thomas (fr_FR)
- Ting-Ting (zh_CN)
- Trinoids (en_US)
- Veena (en_IN)
- Vicki (en_US)
- Victoria (en_US)
- Whisper (en_US)
- Xander (nl_NL)
- Yelda (tr_TR)
- Yuna (ko_KR)
- Yuri (ru_RU)
- Zarvox (en_US)
- Zosia (pl_PL)
- Zuzana (cs_CZ)
