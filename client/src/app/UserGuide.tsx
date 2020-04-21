import React from 'react';
import styles from './UserGuide.module.scss';

interface UserGuideProps {}

const UserGuide: React.FC<UserGuideProps> = () => {
  return (
    <div className={styles.userGuide}>
      <h2>Introduction</h2>
      <p>
        Welcome! Math IDE lets you write sequences of math expressions and
        instantly evaluate them for any input data that you provide.{' '}
        <b>
          Select a file in the left panel to start writing your own math
          expressions
        </b>{' '}
        or continue reading this guide to get familiar with how Math IDE works.
      </p>
      <h2>Beta Disclaimer</h2>
      <p>
        Please note that this is a beta version and the syntax described below
        may change in the future.
      </p>
      <h2>Getting Started</h2>
      <p>
        In the left panel, you can create multiple files. Each file is an
        independent environment where you can write sequences of math
        expressions. Let's start with a simple addition:
      </p>
      <pre className={styles.codeSnippet}>
        14 + 7<span className={styles.tokenVirtual}> = 21</span>
      </pre>
      <p>
        Note how the result of this expression is slightly faded. It means that
        it has been automatically generated and cannot be edited. You can enter
        multiple expressions - each in a new line. Here is an example:
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
        <br />E = (m * v ^ 2) / 2
        <span className={styles.tokenVirtual}> = 180</span>
      </pre>
      <h2>Comments</h2>
      <p>
        Besides regular mathematical expressions, you may want to write some
        text to make your calculations easier to understand. To do that, start a
        line with <span className={styles.inlineCode}>//</span>. The line will
        be marked as a comment and the program won't treat it as a math
        expression.
      </p>
      <pre className={styles.codeSnippet}>
        <span className={styles.tokenComment}>// This is a comment</span> <br />
        1 * 2 * 3 * 4<span className={styles.tokenVirtual}> = 24</span>
        <br />
        <br />
        <span className={styles.tokenComment}>
          // And this is another comment
        </span>
        <br />
        4!<span className={styles.tokenVirtual}> = 24</span>
      </pre>
    </div>
  );
};

export default UserGuide;
