import React from 'react';
import { Link } from 'react-router-dom';
import styles from './UserGuide.module.scss';

interface UserGuideProps {}

const UserGuide: React.FC<UserGuideProps> = () => {
  return (
    <div className={styles.userGuide}>
      <h2>Introduction</h2>
      <p>
        Welcome! Math IDE lets you write sequences of math expressions and instantly evaluate them
        for any input data that you provide.{' '}
        <b>Select a file in the left panel to start writing your own math expressions</b> or
        continue reading this guide to get familiar with how Math IDE works.
      </p>
      <h2>Beta Disclaimer</h2>
      <p>
        Please note that this is a beta version and the syntax described below may change in the
        future.
      </p>
      <h2>Getting Started</h2>
      <p>
        In the left panel, you can create multiple files. Each file is an independent environment
        where you can write sequences of math expressions. Let's start with a simple addition:
      </p>
      <pre className={styles.codeSnippet}>
        14 + 7<span className={styles.tokenVirtual}> = 21</span>
      </pre>
      <p>
        Note how the result of this expression is slightly faded. It means that it has been
        automatically generated and cannot be edited. You can enter multiple expressions - each in a
        new line. Here is an example:
      </p>
      <pre className={styles.codeSnippet}>
        2 + 2 * 2<span className={styles.tokenVirtual}> = 6</span>
        <br />7 * (6 + 1)<span className={styles.tokenVirtual}> = 49</span>
        <br />
        123 / 5<span className={styles.tokenVirtual}> = 2.46</span>
        <br />2 ^ 3<span className={styles.tokenVirtual}> = 8</span>
      </pre>
      <h2>Variables</h2>
      <p>Here is how you can declare variables:</p>
      <pre className={styles.codeSnippet}>
        x = 10
        <br />x * 3.6<span className={styles.tokenVirtual}> = 36</span>
      </pre>
      <p>Another example:</p>
      <pre className={styles.codeSnippet}>
        m = 10
        <br />v = 2 * 3<span className={styles.tokenVirtual}> = 6</span>
        <br />E = (m * v ^ 2) / 2<span className={styles.tokenVirtual}> = 180</span>
      </pre>
      <h2>Comments</h2>
      <p>
        Besides regular mathematical expressions, you may want to write some text to make your
        calculations easier to understand. To do that, start a line with{' '}
        <span className={styles.inlineCode}>//</span>. The line will be marked as a comment and the
        program won't treat it as a math expression.
      </p>
      <pre className={styles.codeSnippet}>
        <span className={styles.tokenComment}>// This is a comment</span> <br />3 * 3 * 3 * 3
        <span className={styles.tokenVirtual}> = 81</span>
        <br />
        <br />
        <span className={styles.tokenComment}>// And this is another comment</span>
        <br />
        3^4<span className={styles.tokenVirtual}> = 81</span>
      </pre>
      <h2>Constants and Functions</h2>
      <p>Right now there is only a single constant available:</p>
      <pre className={styles.codeSnippet}>
        PI<span className={styles.tokenVirtual}> = 3.141592653589793</span>
      </pre>
      <p>and a few functions:</p>
      <pre className={styles.codeSnippet}>
        <span className={styles.tokenComment}>// Square root:</span>
        <br />
        sqrt(4)<span className={styles.tokenVirtual}> = 2</span>
        <br />
        <br />
        <span className={styles.tokenComment}>// Natural logarithm:</span>
        <br />
        log(2.718281828459045)<span className={styles.tokenVirtual}> = 1</span>
        <br />
        <br />
        <span className={styles.tokenComment}>// Factorial: 3! = 1 * 2 * 3</span>
        <br />
        factorial(3)<span className={styles.tokenVirtual}> = 6</span>
        <br />
        <br />
        <span className={styles.tokenComment}>// Absolute value:</span>
        <br />
        abs(-5)<span className={styles.tokenVirtual}> = 5</span>
        <br />
        abs(5)<span className={styles.tokenVirtual}> = 5</span>
        <br />
        <br />
        <span className={styles.tokenComment}>// Sign function:</span>
        <br />
        sign(-5)<span className={styles.tokenVirtual}> = -1</span>
        <br />
        sign(0)<span className={styles.tokenVirtual}> = 0</span>
        <br />
        sign(5)<span className={styles.tokenVirtual}> = 1</span>
        <br />
        <br />
        <span className={styles.tokenComment}>// Trigonometric functions:</span>
        <br />
        sin(PI/2)<span className={styles.tokenVirtual}> = 1</span>
        <br />
        asin(0)<span className={styles.tokenVirtual}> = 0</span>
        <br />
        <br />
        cos(0)<span className={styles.tokenVirtual}> = 1</span>
        <br />
        acos(1)<span className={styles.tokenVirtual}> = 0</span>
        <br />
        <br />
        tan(0)<span className={styles.tokenVirtual}> = 0</span>
        <br />
        atan(0)<span className={styles.tokenVirtual}> = 0</span>
      </pre>
      <h2>Units</h2>
      <p>
        Math IDE supports values with <Link to="/units-list">units</Link>. Unit symbol needs to be
        placed right after the number, without separating space character. For example:
      </p>
      <pre className={styles.codeSnippet}>
        15kg
        <br />
        2.54m
        <br />
        60s
      </pre>
      <p>You can also use complex units, such as:</p>
      <pre className={styles.codeSnippet}>
        10kg*m
        <br />
        36m/s
        <br />
        9.81m/s^2
        <br />
        9.81m/s/s
        <br />
        9.81m*s^-2
      </pre>
      <p>Keep in mind that spaces are important:</p>
      <pre className={styles.codeSnippet}>
        <span className={styles.tokenComment}>// 10 meters per second:</span>
        <br />
        10m/s
        <br />
        <br />
        <span className={styles.tokenComment}>// 10 meters divided by variable "s":</span>
        <br />
        10m / s
      </pre>
      <p>
        All operations such as addition, subtraction, multiplication, etc. are possible for values
        with units:
      </p>
      <pre className={styles.codeSnippet}>
        2kg + 500g<span className={styles.tokenVirtual}> = 2.5kg</span>
        <br />
        10N / 2.5m^2<span className={styles.tokenVirtual}> = 4Pa</span>
        <br />
        (1m * 4m)^2<span className={styles.tokenVirtual}> = 16m^4</span>
      </pre>
      <p>Trying to add or subtract values with incompatibe units will result in an error:</p>
      <pre className={styles.codeSnippet}>
        <span className={styles.tokenError}>4m + 4s</span>
        <span className={styles.tokenVirtual}>
          {'  '}
          Error: Trying to add/subtract values with incompatible units: "m" and "s"
        </span>
        <br />
        <span className={styles.tokenError}>7s - 5s - 2kg</span>
        <span className={styles.tokenVirtual}>
          {'  '}
          Error: Trying to add/subtract values with incompatible units: "s" and "kg"
        </span>
        <br />
      </pre>
      <p>You can specify a result unit by using square brackets notation:</p>
      <pre className={styles.codeSnippet}>
        2.5kg = [g]<span className={styles.tokenVirtual}> = 2500g</span>
        <br />E = 1500J = [N*m]<span className={styles.tokenVirtual}> = 1500N*m</span>
        <br />E = [kJ]<span className={styles.tokenVirtual}> = 1.5kJ</span>
        <br />E = <span className={styles.tokenError}>[kg]</span>
        <span className={styles.tokenVirtual}>
          {'  '}
          Error: "kg*m^2/s^2" cannot be converted to "kg"
        </span>
      </pre>
      <p>
        Here is a list of all available units: <Link to="/units-list">Units List</Link>.
      </p>
    </div>
  );
};

export default UserGuide;
