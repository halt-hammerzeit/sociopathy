// http://data.iana.org/TLD/tlds-alpha-by-domain.txt

var Domain_zones_in_punycode = 
[
    'AC',
    'AD',
    'AE',
    'AERO',
    'AF',
    'AG',
    'AI',
    'AL',
    'AM',
    'AN',
    'AO',
    'AQ',
    'AR',
    'ARPA',
    'AS',
    'ASIA',
    'AT',
    'AU',
    'AW',
    'AX',
    'AZ',
    'BA',
    'BB',
    'BD',
    'BE',
    'BF',
    'BG',
    'BH',
    'BI',
    'BIZ',
    'BJ',
    'BM',
    'BN',
    'BO',
    'BR',
    'BS',
    'BT',
    'BV',
    'BW',
    'BY',
    'BZ',
    'CA',
    'CAT',
    'CC',
    'CD',
    'CF',
    'CG',
    'CH',
    'CI',
    'CK',
    'CL',
    'CM',
    'CN',
    'CO',
    'COM',
    'COOP',
    'CR',
    'CU',
    'CV',
    'CW',
    'CX',
    'CY',
    'CZ',
    'DE',
    'DJ',
    'DK',
    'DM',
    'DO',
    'DZ',
    'EC',
    'EDU',
    'EE',
    'EG',
    'ER',
    'ES',
    'ET',
    'EU',
    'FI',
    'FJ',
    'FK',
    'FM',
    'FO',
    'FR',
    'GA',
    'GB',
    'GD',
    'GE',
    'GF',
    'GG',
    'GH',
    'GI',
    'GL',
    'GM',
    'GN',
    'GOV',
    'GP',
    'GQ',
    'GR',
    'GS',
    'GT',
    'GU',
    'GW',
    'GY',
    'HK',
    'HM',
    'HN',
    'HR',
    'HT',
    'HU',
    'ID',
    'IE',
    'IL',
    'IM',
    'IN',
    'INFO',
    'INT',
    'IO',
    'IQ',
    'IR',
    'IS',
    'IT',
    'JE',
    'JM',
    'JO',
    'JOBS',
    'JP',
    'KE',
    'KG',
    'KH',
    'KI',
    'KM',
    'KN',
    'KP',
    'KR',
    'KW',
    'KY',
    'KZ',
    'LA',
    'LB',
    'LC',
    'LI',
    'LK',
    'LR',
    'LS',
    'LT',
    'LU',
    'LV',
    'LY',
    'MA',
    'MC',
    'MD',
    'ME',
    'MG',
    'MH',
    'MIL',
    'MK',
    'ML',
    'MM',
    'MN',
    'MO',
    'MOBI',
    'MP',
    'MQ',
    'MR',
    'MS',
    'MT',
    'MU',
    'MUSEUM',
    'MV',
    'MW',
    'MX',
    'MY',
    'MZ',
    'NA',
    'NAME',
    'NC',
    'NE',
    'NET',
    'NF',
    'NG',
    'NI',
    'NL',
    'NO',
    'NP',
    'NR',
    'NU',
    'NZ',
    'OM',
    'ORG',
    'PA',
    'PE',
    'PF',
    'PG',
    'PH',
    'PK',
    'PL',
    'PM',
    'PN',
    'POST',
    'PR',
    'PRO',
    'PS',
    'PT',
    'PW',
    'PY',
    'QA',
    'RE',
    'RO',
    'RS',
    'RU',
    'RW',
    'SA',
    'SB',
    'SC',
    'SD',
    'SE',
    'SG',
    'SH',
    'SI',
    'SJ',
    'SK',
    'SL',
    'SM',
    'SN',
    'SO',
    'SR',
    'ST',
    'SU',
    'SV',
    'SX',
    'SY',
    'SZ',
    'TC',
    'TD',
    'TEL',
    'TF',
    'TG',
    'TH',
    'TJ',
    'TK',
    'TL',
    'TM',
    'TN',
    'TO',
    'TP',
    'TR',
    'TRAVEL',
    'TT',
    'TV',
    'TW',
    'TZ',
    'UA',
    'UG',
    'UK',
    'US',
    'UY',
    'UZ',
    'VA',
    'VC',
    'VE',
    'VG',
    'VI',
    'VN',
    'VU',
    'WF',
    'WS',
    'XN--0ZWM56D',
    'XN--11B5BS3A9AJ6G',
    'XN--3E0B707E',
    'XN--45BRJ9C',
    'XN--80AKHBYKNJ4F',
    'XN--80AO21A',
    'XN--90A3AC',
    'XN--9T4B11YI5A',
    'XN--CLCHC0EA0B2G2A9GCD',
    'XN--DEBA0AD',
    'XN--FIQS8S',
    'XN--FIQZ9S',
    'XN--FPCRJ9C3D',
    'XN--FZC2C9E2C',
    'XN--G6W251D',
    'XN--GECRJ9C',
    'XN--H2BRJ9C',
    'XN--HGBK6AJ7F53BBA',
    'XN--HLCJ6AYA9ESC7A',
    'XN--J1AMH',
    'XN--J6W193G',
    'XN--JXALPDLP',
    'XN--KGBECHTV',
    'XN--KPRW13D',
    'XN--KPRY57D',
    'XN--L1ACC',
    'XN--LGBBAT1AD8J',
    'XN--MGB9AWBF',
    'XN--MGBAAM7A8H',
    'XN--MGBAYH7GPA',
    'XN--MGBBH1A71E',
    'XN--MGBC0A9AZCG',
    'XN--MGBERP4A5D4AR',
    'XN--MGBX4CD0AB',
    'XN--O3CW4H',
    'XN--OGBPF8FL',
    'XN--P1AI',
    'XN--PGBS0DH',
    'XN--S9BRJ9C',
    'XN--WGBH1C',
    'XN--WGBL6A',
    'XN--XKC2AL3HYE2A',
    'XN--XKC2DL3A5EE0H',
    'XN--YFRO4I67O',
    'XN--YGBI2AMMX',
    'XN--ZCKZAH',
    'XXX',
    'YE',
    'YT',
    'ZA',
    'ZM',
    'ZW'
]

var Domain_zones = Domain_zones_in_punycode.map(function(zone)
{
	zone = zone.toLowerCase()

	if (zone.starts_with('xn--'))
	{
		return punycode.toUnicode(zone)
	}
	
	return zone
})

var Dns =
{
	can_be_url: function(text)
	{
		if (text.has('/'))
			text = text.substring(0, text.indexOf('/'))
		
		return !Domain_zones.filter(function(zone)
		{
			return text.ends_with('.' + zone)
		})
		.is_empty()
	}
}