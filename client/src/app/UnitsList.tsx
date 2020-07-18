import React, { Fragment } from 'react';
import styles from './UnitsList.module.scss';

const createUnitWithPrefixes = (symbol) => [
  { unit: `1Y${symbol}`, equivalent: { base: `1`, exponent: '24', unit: symbol } },
  { unit: `1Z${symbol}`, equivalent: { base: `1`, exponent: '21', unit: symbol } },
  { unit: `1E${symbol}`, equivalent: { base: `1`, exponent: '18', unit: symbol } },
  { unit: `1P${symbol}`, equivalent: { base: `1`, exponent: '15', unit: symbol } },
  { unit: `1T${symbol}`, equivalent: { base: `1`, exponent: '12', unit: symbol } },
  { unit: `1G${symbol}`, equivalent: { base: `1`, exponent: '9', unit: symbol } },
  { unit: `1M${symbol}`, equivalent: { base: `1`, exponent: '6', unit: symbol } },
  { unit: `1k${symbol}`, equivalent: { base: `1`, exponent: '3', unit: symbol } },
  { unit: `1h${symbol}`, equivalent: { base: `1`, exponent: '2', unit: symbol } },
  { unit: `1da${symbol}`, equivalent: { base: `1`, exponent: '1', unit: symbol } },
  { unit: `1${symbol}`, equivalent: { base: `1`, exponent: '', unit: symbol } },
  { unit: `1d${symbol}`, equivalent: { base: `1`, exponent: '-1', unit: symbol } },
  { unit: `1c${symbol}`, equivalent: { base: `1`, exponent: '-2', unit: symbol } },
  { unit: `1m${symbol}`, equivalent: { base: `1`, exponent: '-3', unit: symbol } },
  { unit: `1u${symbol}`, equivalent: { base: `1`, exponent: '-6', unit: symbol } },
  { unit: `1n${symbol}`, equivalent: { base: `1`, exponent: '-9', unit: symbol } },
  { unit: `1p${symbol}`, equivalent: { base: `1`, exponent: '-12', unit: symbol } },
  { unit: `1f${symbol}`, equivalent: { base: `1`, exponent: '-15', unit: symbol } },
  { unit: `1a${symbol}`, equivalent: { base: `1`, exponent: '-18', unit: symbol } },
  { unit: `1z${symbol}`, equivalent: { base: `1`, exponent: '-21', unit: symbol } },
  { unit: `1y${symbol}`, equivalent: { base: `1`, exponent: '-24', unit: symbol } },
];

const unitsList = {
  KILOGRAM: [
    { unit: '1Yg', equivalent: { base: '1', exponent: '21', unit: 'kg' } },
    { unit: '1Zg', equivalent: { base: '1', exponent: '18', unit: 'kg' } },
    { unit: '1Eg', equivalent: { base: '1', exponent: '15', unit: 'kg' } },
    { unit: '1Pg', equivalent: { base: '1', exponent: '12', unit: 'kg' } },
    { unit: '1Tg', equivalent: { base: '1', exponent: '9', unit: 'kg' } },
    { unit: '1Gg', equivalent: { base: '1', exponent: '6', unit: 'kg' } },
    { unit: '1Mg', equivalent: { base: '1', exponent: '3', unit: 'kg' } },
    { unit: '1kg', equivalent: { base: '1', exponent: '', unit: 'kg' } },
    { unit: '1hg', equivalent: { base: '1', exponent: '-1', unit: 'kg' } },
    { unit: '1dag', equivalent: { base: '1', exponent: '-2', unit: 'kg' } },
    { unit: '1g', equivalent: { base: '1', exponent: '-3', unit: 'kg' } },
    { unit: '1dg', equivalent: { base: '1', exponent: '-4', unit: 'kg' } },
    { unit: '1cg', equivalent: { base: '1', exponent: '-5', unit: 'kg' } },
    { unit: '1mg', equivalent: { base: '1', exponent: '-6', unit: 'kg' } },
    { unit: '1ug', equivalent: { base: '1', exponent: '-9', unit: 'kg' } },
    { unit: '1ng', equivalent: { base: '1', exponent: '-12', unit: 'kg' } },
    { unit: '1pg', equivalent: { base: '1', exponent: '-15', unit: 'kg' } },
    { unit: '1fg', equivalent: { base: '1', exponent: '-18', unit: 'kg' } },
    { unit: '1ag', equivalent: { base: '1', exponent: '-21', unit: 'kg' } },
    { unit: '1zg', equivalent: { base: '1', exponent: '-24', unit: 'kg' } },
    { unit: '1yg', equivalent: { base: '1', exponent: '-27', unit: 'kg' } },
  ],
  TON: [
    { unit: '1Gt', equivalent: { base: '1', exponent: '12', unit: 'kg' } },
    { unit: '1Mt', equivalent: { base: '1', exponent: '9', unit: 'kg' } },
    { unit: '1kt', equivalent: { base: '1', exponent: '6', unit: 'kg' } },
    { unit: '1t', equivalent: { base: '1', exponent: '3', unit: 'kg' } },
  ],
  LB: [{ unit: '1lb', equivalent: { base: '0.45359237', exponent: '', unit: 'kg' } }],
  SECOND: createUnitWithPrefixes('s'),
  OTHER_TIME: [
    { unit: '1min', equivalent: { base: '60', exponent: '', unit: 's' } },
    { unit: '1h', equivalent: { base: '3600', exponent: '', unit: 's' } },
  ],
  METER: createUnitWithPrefixes('m'),
  OTHER_LENGTH: [
    { unit: '1in', equivalent: { base: '0.0254', exponent: '', unit: 'm' } },
    { unit: '1ft', equivalent: { base: '12', exponent: '', unit: 'in' } },
    { unit: '1yd', equivalent: { base: '3', exponent: '', unit: 'ft' } },
    { unit: '1mi', equivalent: { base: '1609.344', exponent: '', unit: 'm' } },
  ],
  VOLUME: [{ unit: '1l', equivalent: { base: '1', exponent: '', unit: 'dm^3' } }],
  CURRENT: createUnitWithPrefixes('A'),
  TEMPERATURE: createUnitWithPrefixes('K'),
  AMOUNT: createUnitWithPrefixes('mol'),
  LUMINOUS_INTENSITY: createUnitWithPrefixes('cd'),
  FREQUENCY: createUnitWithPrefixes('Hz'),
  FORCE: createUnitWithPrefixes('N'),
  PRESSURE: createUnitWithPrefixes('Pa'),
  ENERGY: createUnitWithPrefixes('J'),
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
};

interface UnitsListProps {}

const UnitsList: React.FC<UnitsListProps> = () => {
  const mapUnits = (units) =>
    units.map(({ unit, equivalent }, index) => (
      <Fragment key={`${unit}-${index}`}>
        {unit}
        <span className={styles.tokenVirtual}> = {equivalent.base}</span>
        {equivalent.exponent && (
          <>
            <span className={styles.tokenVirtual}>·10</span>
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
        {mapUnits(unitsList.LB)}
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
    </div>
  );
};

export default UnitsList;
