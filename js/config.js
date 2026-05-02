const APP_CONFIG = {
  appName: 'ELDT Hazmat Training',
  providerName: 'Acme Hazmat Training Provider',
  providerTprId: 'TPR-PLACEHOLDER-001',
  passPercent: 80,
  testQuestionCount: 25,
  localStorageKey: 'hazmatEldtAppV1'
};

const MODULES = [
  { id: 1, title: 'Basic Hazmat Rules', requiredWatchPercent: 90, durationSeconds: 120 },
  { id: 2, title: 'Hazard Classes and Divisions', requiredWatchPercent: 90, durationSeconds: 130 },
  { id: 3, title: 'Shipping Papers', requiredWatchPercent: 90, durationSeconds: 125 },
  { id: 4, title: 'Marking, Labeling, Placarding', requiredWatchPercent: 90, durationSeconds: 140 },
  { id: 5, title: 'Loading and Segregation', requiredWatchPercent: 90, durationSeconds: 150 },
  { id: 6, title: 'Emergency Response', requiredWatchPercent: 90, durationSeconds: 135 },
  { id: 7, title: 'Security Awareness', requiredWatchPercent: 90, durationSeconds: 120 },
  { id: 8, title: 'Final Review', requiredWatchPercent: 90, durationSeconds: 120 }
];
