import React, { Fragment } from 'react';

import { Modal } from '../shared/modal';

import TokenBlock from './TokenBlock';

import styles from './AnalyzerPage.module.scss';

interface StepDetailsModalProps {
  onHide: Function;
  stepResults: any[];
  currentModalStep: number | null;
}

const StepDetailsModal: React.FC<StepDetailsModalProps> = ({
  onHide,
  stepResults,
  currentModalStep,
}) => {
  if (currentModalStep === null) {
    return null;
  }
  const { stepName, description, legend } = stepResults[currentModalStep];

  return (
    <Modal visible className={styles.stepDetailsModal} title={stepName} onHide={onHide}>
      <p>{description}</p>
      <div>
        {legend.length > 0 && (
          <Fragment>
            <span className={styles.legendLabel}>Legend:</span>
            {legend.map(({ token, label }, index) => (
              <div key={index} className={styles.legendEntry}>
                <TokenBlock id={`legend-token-${index}`} token={token} showTooltip={false} />
                <pre>{label}</pre>
              </div>
            ))}
          </Fragment>
        )}
      </div>
    </Modal>
  );
};

export default StepDetailsModal;
