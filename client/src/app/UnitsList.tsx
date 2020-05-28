import React from 'react';
import styles from './UserGuide.module.scss';

const createUnitWithPrefixes = (symbol) => [
  { unit: `1Y${symbol}`, equivaluent: `1e24${symbol}` },
  { unit: `1Z${symbol}`, equivaluent: `1e21${symbol}` },
  { unit: `1E${symbol}`, equivaluent: `1e18${symbol}` },
  { unit: `1P${symbol}`, equivaluent: `1e15${symbol}` },
  { unit: `1T${symbol}`, equivaluent: `1e12${symbol}` },
  { unit: `1G${symbol}`, equivaluent: `1e9${symbol}` },
  { unit: `1M${symbol}`, equivaluent: `1e6${symbol}` },
  { unit: `1k${symbol}`, equivaluent: `1e3${symbol}` },
  { unit: `1h${symbol}`, equivaluent: `1e2${symbol}` },
  { unit: `1da${symbol}`, equivaluent: `1e1${symbol}` },
  { unit: `1${symbol}`, equivaluent: `1${symbol}` },
  { unit: `1d${symbol}`, equivaluent: `1e-1${symbol}` },
  { unit: `1c${symbol}`, equivaluent: `1e-2${symbol}` },
  { unit: `1m${symbol}`, equivaluent: `1e-3${symbol}` },
  { unit: `1u${symbol}`, equivaluent: `1e-6${symbol}` },
  { unit: `1n${symbol}`, equivaluent: `1e-9${symbol}` },
  { unit: `1p${symbol}`, equivaluent: `1e-12${symbol}` },
  { unit: `1f${symbol}`, equivaluent: `1e-15${symbol}` },
  { unit: `1a${symbol}`, equivaluent: `1e-18${symbol}` },
  { unit: `1z${symbol}`, equivaluent: `1e-21${symbol}` },
  { unit: `1y${symbol}`, equivaluent: `1e-24${symbol}` },
];

const unitsList = {
  KILOGRAM: [
    { unit: '1Yg', equivaluent: '1e21kg' },
    { unit: '1Zg', equivaluent: '1e18kg' },
    { unit: '1Eg', equivaluent: '1e15kg' },
    { unit: '1Pg', equivaluent: '1e12kg' },
    { unit: '1Tg', equivaluent: '1e9kg' },
    { unit: '1Gg', equivaluent: '1e6kg' },
    { unit: '1Mg', equivaluent: '1e3kg' },
    { unit: '1kg', equivaluent: '1kg' },
    { unit: '1hg', equivaluent: '1e-1kg' },
    { unit: '1dag', equivaluent: '1e-2kg' },
    { unit: '1g', equivaluent: '1e-3kg' },
    { unit: '1dg', equivaluent: '1e-4kg' },
    { unit: '1cg', equivaluent: '1e-5kg' },
    { unit: '1mg', equivaluent: '1e-6kg' },
    { unit: '1ug', equivaluent: '1e-9kg' },
    { unit: '1ng', equivaluent: '1e-12kg' },
    { unit: '1pg', equivaluent: '1e-15kg' },
    { unit: '1fg', equivaluent: '1e-18kg' },
    { unit: '1ag', equivaluent: '1e-21kg' },
    { unit: '1zg', equivaluent: '1e-24kg' },
    { unit: '1yg', equivaluent: '1e-27kg' },
  ],
  TON: [
    { unit: '1Gt', equivaluent: '1e12kg' },
    { unit: '1Mt', equivaluent: '1e9kg' },
    { unit: '1kt', equivaluent: '1e6kg' },
    { unit: '1t', equivaluent: '1e3kg' },
  ],
  LB: [{ unit: '1lb', equivaluent: '0.45359237kg' }],
  SECOND: createUnitWithPrefixes('s'),
  OTHER_TIME: [
    { unit: '1min', equivaluent: '60s' },
    { unit: '1h', equivaluent: '3600s' },
  ],
  METER: createUnitWithPrefixes('m'),
  OTHER_LENGTH: [
    { unit: '1in', equivaluent: '0.0254m' },
    { unit: '1ft', equivaluent: '12in' },
    { unit: '1yd', equivaluent: '3ft' },
    { unit: '1mi', equivaluent: '1609.344m' },
  ],
  VOLUME: [{ unit: '1l', equivaluent: '1dm^3' }],
  CURRENT: createUnitWithPrefixes('A'),
  TEMPERATURE: createUnitWithPrefixes('K'),
  AMOUNT: createUnitWithPrefixes('mol'),
  LUMINOUS_INTENSITY: createUnitWithPrefixes('cd'),
  FREQUENCY: createUnitWithPrefixes('Hz'),
  FORCE: createUnitWithPrefixes('N'),
  PRESSURE: createUnitWithPrefixes('Pa'),
  ENERGY: createUnitWithPrefixes('J'),
  POWER: createUnitWithPrefixes('W'),
  CHARGE: createUnitWithPrefixes('C'),
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
    units.map(({ unit, equivaluent }) => (
      <>
        {unit}
        <span className={styles.tokenVirtual}> = {equivaluent}</span>
        <br />
      </>
    ));
  return (
    <div className={styles.userGuide}>
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
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.ENERGY)}</pre>
      <h3>Power</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.POWER)}</pre>
      <h3>Electric charge</h3>
      <pre className={styles.codeSnippet}>{mapUnits(unitsList.CHARGE)}</pre>
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
