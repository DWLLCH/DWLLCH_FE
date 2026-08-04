const TYPES = [
  'feat',
  'fix',
  'design',
  '!BREAKING CHANGE',
  'hotfix',
  'style',
  'refactor',
  'comment',
  'docs',
  'test',
  'chore',
  'rename',
  'remove',
];

module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^([\w!]+(?:\s+[\w!]+)*): (.+)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
  rules: {
    'type-enum': [2, 'always', TYPES],
    'type-empty': [2, 'never'],
    'type-case': [0],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
    'subject-full-stop': [0],
    'header-max-length': [0],
  },
};
