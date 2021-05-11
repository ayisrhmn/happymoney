import moment from 'moment';
import 'moment/locale/id';

moment().locale('id');

export const lastSeen = (timestamp: string) => {
  return `Aktif ${moment(timestamp).fromNow()}`;
};

export const currencyFormat = (
  num: number,
  prefix: string = 'Rp. ',
  thousandSeparator: string = '.',
) => {
  return (num
    ? [
        prefix,
        num
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator),
      ].filter((d) => d)
    : [prefix, 0]
  ).join(' ');
};

export const numberWithSeparator = (x: number | string | undefined) => {
  if (!x) {
    if (x !== 0) {
      return;
    }
  }

  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
};

export const valInputWithSeparator = (x: number | string | undefined) => {
	const addCommas = (num: any) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const removeNonNumeric = (num: any) => num.toString().replace(/[^0-9]/g, "");

	return addCommas(removeNonNumeric(x));
}

export const number1Rounding = (x: number) => {
  if (x === 0) {
    return '0';
  }
  var toString = x.toString();
  var match = toString.match(/^-?\d+(?:\.\d{0,1})?/);
  if (match !== null) {
    return match[0];
  }
  return x.toString(1);
};

export const getRandomColor = () => {
	let letters = 'BCDEF'.split('');
	let color = '#';

	for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * letters.length)];
	};

	return color;
};

export const getInitialName = (v: any) => {
	const strArr = v?.split(' ');
	const totalStr = strArr?.length;

	if (totalStr === 1) {
		return strArr[0].charAt(0);
	} else if (totalStr === 2) {
		return strArr[0].charAt(0) + strArr[1].charAt(0);
	} else if (totalStr >= 3) {
		return strArr[0].charAt(0) + strArr[2].charAt(0);
	}

	return v;
};
