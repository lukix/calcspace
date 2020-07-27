import React, { Fragment } from 'react';
import styles from './UnitsList.module.scss';

const createUnitWithPrefixes = (symbol) => [
  { unit: `1Y${symbol}`, equivalent: { constant: `1`, exponent: '24', unit: symbol } },
  { unit: `1Z${symbol}`, equivalent: { constant: `1`, exponent: '21', unit: symbol } },
  { unit: `1E${symbol}`, equivalent: { constant: `1`, exponent: '18', unit: symbol } },
  { unit: `1P${symbol}`, equivalent: { constant: `1`, exponent: '15', unit: symbol } },
  { unit: `1T${symbol}`, equivalent: { constant: `1`, exponent: '12', unit: symbol } },
  { unit: `1G${symbol}`, equivalent: { constant: `1`, exponent: '9', unit: symbol } },
  { unit: `1M${symbol}`, equivalent: { constant: `1`, exponent: '6', unit: symbol } },
  { unit: `1k${symbol}`, equivalent: { constant: `1`, exponent: '3', unit: symbol } },
  { unit: `1h${symbol}`, equivalent: { constant: `1`, exponent: '2', unit: symbol } },
  { unit: `1da${symbol}`, equivalent: { constant: `1`, exponent: '1', unit: symbol } },
  { unit: `1${symbol}`, equivalent: { constant: `1`, exponent: '', unit: symbol } },
  { unit: `1d${symbol}`, equivalent: { constant: `1`, exponent: '-1', unit: symbol } },
  { unit: `1c${symbol}`, equivalent: { constant: `1`, exponent: '-2', unit: symbol } },
  { unit: `1m${symbol}`, equivalent: { constant: `1`, exponent: '-3', unit: symbol } },
  { unit: `1u${symbol}`, equivalent: { constant: `1`, exponent: '-6', unit: symbol } },
  { unit: `1n${symbol}`, equivalent: { constant: `1`, exponent: '-9', unit: symbol } },
  { unit: `1p${symbol}`, equivalent: { constant: `1`, exponent: '-12', unit: symbol } },
  { unit: `1f${symbol}`, equivalent: { constant: `1`, exponent: '-15', unit: symbol } },
  { unit: `1a${symbol}`, equivalent: { constant: `1`, exponent: '-18', unit: symbol } },
  { unit: `1z${symbol}`, equivalent: { constant: `1`, exponent: '-21', unit: symbol } },
  { unit: `1y${symbol}`, equivalent: { constant: `1`, exponent: '-24', unit: symbol } },
];

const unitsList = {
  KILOGRAM: [
    { unit: '1Yg', equivalent: { constant: '1', exponent: '21', unit: 'kg' } },
    { unit: '1Zg', equivalent: { constant: '1', exponent: '18', unit: 'kg' } },
    { unit: '1Eg', equivalent: { constant: '1', exponent: '15', unit: 'kg' } },
    { unit: '1Pg', equivalent: { constant: '1', exponent: '12', unit: 'kg' } },
    { unit: '1Tg', equivalent: { constant: '1', exponent: '9', unit: 'kg' } },
    { unit: '1Gg', equivalent: { constant: '1', exponent: '6', unit: 'kg' } },
    { unit: '1Mg', equivalent: { constant: '1', exponent: '3', unit: 'kg' } },
    { unit: '1kg', equivalent: { constant: '1', exponent: '', unit: 'kg' } },
    { unit: '1hg', equivalent: { constant: '1', exponent: '-1', unit: 'kg' } },
    { unit: '1dag', equivalent: { constant: '1', exponent: '-2', unit: 'kg' } },
    { unit: '1g', equivalent: { constant: '1', exponent: '-3', unit: 'kg' } },
    { unit: '1dg', equivalent: { constant: '1', exponent: '-4', unit: 'kg' } },
    { unit: '1cg', equivalent: { constant: '1', exponent: '-5', unit: 'kg' } },
    { unit: '1mg', equivalent: { constant: '1', exponent: '-6', unit: 'kg' } },
    { unit: '1ug', equivalent: { constant: '1', exponent: '-9', unit: 'kg' } },
    { unit: '1ng', equivalent: { constant: '1', exponent: '-12', unit: 'kg' } },
    { unit: '1pg', equivalent: { constant: '1', exponent: '-15', unit: 'kg' } },
    { unit: '1fg', equivalent: { constant: '1', exponent: '-18', unit: 'kg' } },
    { unit: '1ag', equivalent: { constant: '1', exponent: '-21', unit: 'kg' } },
    { unit: '1zg', equivalent: { constant: '1', exponent: '-24', unit: 'kg' } },
    { unit: '1yg', equivalent: { constant: '1', exponent: '-27', unit: 'kg' } },
  ],
  TON: [
    { unit: '1Gt', equivalent: { constant: '1', exponent: '12', unit: 'kg' } },
    { unit: '1Mt', equivalent: { constant: '1', exponent: '9', unit: 'kg' } },
    { unit: '1kt', equivalent: { constant: '1', exponent: '6', unit: 'kg' } },
    { unit: '1t', equivalent: { constant: '1', exponent: '3', unit: 'kg' } },
  ],
  IMPERIAL_MASS: [
    { unit: '1oz', equivalent: { constant: '28.349523125', exponent: '', unit: 'g' } },
    { unit: '1lb', equivalent: { constant: '0.45359237', exponent: '', unit: 'kg' } },
  ],
  SECOND: createUnitWithPrefixes('s'),
  OTHER_TIME: [
    { unit: '1min', equivalent: { constant: '60', exponent: '', unit: 's' } },
    { unit: '1h', equivalent: { constant: '3600', exponent: '', unit: 's' } },
  ],
  METER: createUnitWithPrefixes('m'),
  OTHER_LENGTH: [
    { unit: '1in', equivalent: { constant: '0.0254', exponent: '', unit: 'm' } },
    { unit: '1ft', equivalent: { constant: '12', exponent: '', unit: 'in' } },
    { unit: '1yd', equivalent: { constant: '3', exponent: '', unit: 'ft' } },
    { unit: '1mi', equivalent: { constant: '1609.344', exponent: '', unit: 'm' } },
  ],
  ANGLE: [
    { unit: '1deg', equivalent: { constant: '0.017453292519943295', exponent: '', unit: 'rad' } },
    { unit: '1rad', equivalent: { constant: '1', exponent: '', unit: '' } },
  ],
  VOLUME: [{ unit: '1l', equivalent: { constant: '1', exponent: '', unit: 'dm^3' } }],
  CURRENT: createUnitWithPrefixes('A'),
  TEMPERATURE: createUnitWithPrefixes('K'),
  AMOUNT: createUnitWithPrefixes('mol'),
  LUMINOUS_INTENSITY: createUnitWithPrefixes('cd'),
  FREQUENCY: createUnitWithPrefixes('Hz'),
  FORCE: createUnitWithPrefixes('N'),
  PRESSURE: createUnitWithPrefixes('Pa'),
  ENERGY: createUnitWithPrefixes('J'),
  ELECTRONVOLT: [
    { unit: '1YeV', equivalent: { constant: '1', exponent: '24', unit: 'eV' } },
    { unit: '1ZeV', equivalent: { constant: '1', exponent: '21', unit: 'eV' } },
    { unit: '1EeV', equivalent: { constant: '1', exponent: '18', unit: 'eV' } },
    { unit: '1PeV', equivalent: { constant: '1', exponent: '15', unit: 'eV' } },
    { unit: '1TeV', equivalent: { constant: '1', exponent: '12', unit: 'eV' } },
    { unit: '1GeV', equivalent: { constant: '1', exponent: '9', unit: 'eV' } },
    { unit: '1MeV', equivalent: { constant: '1', exponent: '6', unit: 'eV' } },
    { unit: '1keV', equivalent: { constant: '1', exponent: '3', unit: 'eV' } },
    { unit: '1heV', equivalent: { constant: '1', exponent: '2', unit: 'eV' } },
    { unit: '1daeV', equivalent: { constant: '1', exponent: '1', unit: 'eV' } },
    { unit: '1eV', equivalent: { constant: '1.602176634', exponent: '-19', unit: 'J' } },
    { unit: '1deV', equivalent: { constant: '1', exponent: '-1', unit: 'eV' } },
    { unit: '1ceV', equivalent: { constant: '1', exponent: '-2', unit: 'eV' } },
    { unit: '1meV', equivalent: { constant: '1', exponent: '-3', unit: 'eV' } },
    { unit: '1ueV', equivalent: { constant: '1', exponent: '-6', unit: 'eV' } },
    { unit: '1neV', equivalent: { constant: '1', exponent: '-9', unit: 'eV' } },
    { unit: '1peV', equivalent: { constant: '1', exponent: '-12', unit: 'eV' } },
    { unit: '1feV', equivalent: { constant: '1', exponent: '-15', unit: 'eV' } },
    { unit: '1aeV', equivalent: { constant: '1', exponent: '-18', unit: 'eV' } },
    { unit: '1zeV', equivalent: { constant: '1', exponent: '-21', unit: 'eV' } },
    { unit: '1yeV', equivalent: { constant: '1', exponent: '-24', unit: 'eV' } },
  ],
  WATT_HOUR: createUnitWithPrefixes('Wh'),
  POWER: createUnitWithPrefixes('W'),
  CHARGE: createUnitWithPrefixes('C'),
  AMPERE_HOUR: createUnitWithPrefixes('Ah'),
  VOLTAGE: createUnitWithPrefixes('V'),
  CAPACITANCE: createUnitWithPrefixes('F'),
  RESISTANCE: createUnitWithPrefixes('Ohm'),
  CONDUCTANCE: createUnitWithPrefixes('S'),
  MAGNETIC_FLUX: createUnitWithPrefixes('Wb'),
  MAGNETIC_FLUX_DENSITY: createUnitWithPrefixes('T'),
  INDUCTANCE: createUnitWithPrefixes('H'),
  LUMINOUS_FLUX: createUnitWithPrefixes('lm'),
  ILLUMINANCE: createUnitWithPrefixes('lx'),
  RADIOACTIVITY: createUnitWithPrefixes('Bq'),
  ABSORBED_DOSE: createUnitWithPrefixes('Gy'),
  EQUIVALENT_DOSE: createUnitWithPrefixes('Sv'),
  CATALYTIC_ACTIVITY: createUnitWithPrefixes('kat'),
  BIT_DECIMAL_PREFIXES: [
    { unit: '1Yb', equivalent: { exponent: '24', unit: 'b' } },
    { unit: '1Zb', equivalent: { exponent: '21', unit: 'b' } },
    { unit: '1Eb', equivalent: { exponent: '18', unit: 'b' } },
    { unit: '1Pb', equivalent: { exponent: '15', unit: 'b' } },
    { unit: '1Tb', equivalent: { exponent: '12', unit: 'b' } },
    { unit: '1Gb', equivalent: { exponent: '9', unit: 'b' } },
    { unit: '1Mb', equivalent: { exponent: '6', unit: 'b' } },
    { unit: '1kb', equivalent: { exponent: '3', unit: 'b' } },
    { unit: '1b', equivalent: { exponent: '', unit: 'b' } },
  ],
  BIT_BINARY_PREFIXES: [
    { unit: '1Yib', equivalent: { base: '1024', exponent: '8', unit: 'b' } },
    { unit: '1Zib', equivalent: { base: '1024', exponent: '7', unit: 'b' } },
    { unit: '1Eib', equivalent: { base: '1024', exponent: '6', unit: 'b' } },
    { unit: '1Pib', equivalent: { base: '1024', exponent: '5', unit: 'b' } },
    { unit: '1Tib', equivalent: { base: '1024', exponent: '4', unit: 'b' } },
    { unit: '1Gib', equivalent: { base: '1024', exponent: '3', unit: 'b' } },
    { unit: '1Mib', equivalent: { base: '1024', exponent: '2', unit: 'b' } },
    { unit: '1kib', equivalent: { base: '1024', exponent: '1', unit: 'b' } },
  ],
  BYTE_DECIMAL_PREFIXES: [
    { unit: '1YB', equivalent: { exponent: '24', unit: 'B' } },
    { unit: '1ZB', equivalent: { exponent: '21', unit: 'B' } },
    { unit: '1EB', equivalent: { exponent: '18', unit: 'B' } },
    { unit: '1PB', equivalent: { exponent: '15', unit: 'B' } },
    { unit: '1TB', equivalent: { exponent: '12', unit: 'B' } },
    { unit: '1GB', equivalent: { exponent: '9', unit: 'B' } },
    { unit: '1MB', equivalent: { exponent: '6', unit: 'B' } },
    { unit: '1kB', equivalent: { exponent: '3', unit: 'B' } },
    { unit: '1B', equivalent: { constant: '8', exponent: '', unit: 'b' } },
  ],
  BYTE_BINARY_PREFIXES: [
    { unit: '1YiB', equivalent: { base: '1024', exponent: '8', unit: 'B' } },
    { unit: '1ZiB', equivalent: { base: '1024', exponent: '7', unit: 'B' } },
    { unit: '1EiB', equivalent: { base: '1024', exponent: '6', unit: 'B' } },
    { unit: '1PiB', equivalent: { base: '1024', exponent: '5', unit: 'B' } },
    { unit: '1TiB', equivalent: { base: '1024', exponent: '4', unit: 'B' } },
    { unit: '1GiB', equivalent: { base: '1024', exponent: '3', unit: 'B' } },
    { unit: '1MiB', equivalent: { base: '1024', exponent: '2', unit: 'B' } },
    { unit: '1kiB', equivalent: { base: '1024', exponent: '1', unit: 'B' } },
  ],
};

interface UnitsListProps {}

const UnitsList: React.FC<UnitsListProps> = () => {
  const mapUnits = (units) =>
    units.map(({ unit, equivalent }, index) => (
      <Fragment key={`${unit}-${index}`}>
        {unit}
        <span className={styles.tokenVirtual}> = {equivalent.constant || 1}</span>
        {equivalent.exponent && (
          <>
            <span className={styles.tokenVirtual}>·{equivalent.base || 10}</span>
            <sup className={styles.tokenVirtual}>{equivalent.exponent}</sup>
          </>
        )}

        <span className={styles.tokenVirtual}>{equivalent.unit}</span>
        <br />
      </Fragment>
    ));
  return (
    <div className={styles.unitsList}>
      <h2>List of available units</h2>
      <h3>Mass</h3>
      <pre className={styles.codeSnippet}>
        {mapUnits(unitsList.KILOGRAM)}
        <br />
        {mapUnits(unitsList.TON)}
        <br />
        {mapUnits(unitsList.IMPERIAL_MASS)}
      </pre>
      <h3>Time</h3>
      <pre className={styles.codeSnippet}>
        {mapUnits(unitsList.SECOND)}
        <br />
        {mapUnits(unitsList.OTHER_TIME)}
        <br />
      </pre>
      <h3>Length/Distance</h3>
      <pre className={styles.codeSnippet}>
        {mapUnits(unitsList.METER)}
        <br />
        {mapUnits(unitsList.OTHER_LENGTH)}
        <br />
      </pre>
      <h3>Angle</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.ANGLE)}</pre>
      <h3>Volume</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.VOLUME)}</pre>
      <h3>Electric current</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.CURRENT)}</pre>
      <h3>Temperature</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.TEMPERATURE)}</pre>
      <h3>Amount of substance</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.AMOUNT)}</pre>
      <h3>Luminous intensity</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.LUMINOUS_INTENSITY)}</pre>
      <h3>Frequency</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.FREQUENCY)}</pre>
      <h3>Force</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.FORCE)}</pre>
      <h3>Pressure</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.PRESSURE)}</pre>
      <h3>Energy</h3>
      <pre className={styles.codeSnippet}>
        {mapUnits(unitsList.ENERGY)}
        <br />
        {mapUnits(unitsList.ELECTRONVOLT)}
        <br />
        {mapUnits(unitsList.WATT_HOUR)}
      </pre>
      <h3>Power</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.POWER)}</pre>
      <h3>Electric charge</h3>
      <pre className={styles.codeSnippet}>
        {mapUnits(unitsList.CHARGE)}
        <br />
        {mapUnits(unitsList.AMPERE_HOUR)}
      </pre>
      <h3>Electric potential</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.VOLTAGE)}</pre>
      <h3>Capacitance</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.CAPACITANCE)}</pre>
      <h3>Electrical resistance</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.RESISTANCE)}</pre>
      <h3>Electrical conductance</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.CONDUCTANCE)}</pre>
      <h3>Magnetic flux</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.MAGNETIC_FLUX)}</pre>
      <h3>Magnetic flux density</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.MAGNETIC_FLUX_DENSITY)}</pre>
      <h3>Inductance</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.INDUCTANCE)}</pre>
      <h3>Luminous flux</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.LUMINOUS_FLUX)}</pre>
      <h3>Illuminance</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.ILLUMINANCE)}</pre>
      <h3>Radioactivity</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.RADIOACTIVITY)}</pre>
      <h3>Absorbed dose</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.ABSORBED_DOSE)}</pre>
      <h3>Equivalent dose</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.EQUIVALENT_DOSE)}</pre>
      <h3>Catalytic activity</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.CATALYTIC_ACTIVITY)}</pre>
      <h3>Information</h3>
      <pre className={styles.codeSnippet}>
        {mapUnits(unitsList.BIT_DECIMAL_PREFIXES)}
        <br />
        {mapUnits(unitsList.BIT_BINARY_PREFIXES)}
        <br />
        {mapUnits(unitsList.BYTE_DECIMAL_PREFIXES)}
        <br />
        {mapUnits(unitsList.BYTE_BINARY_PREFIXES)}
      </pre>
    </div>
  );
};

export default UnitsList;
