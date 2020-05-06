import React from 'react';

import { SvgIcon } from '@material-ui/core';

import { ReactComponent as BitbucketIconSvg } from 'src/img/svg/bitbucket.svg';
import { ReactComponent as GitlabIconSvg } from 'src/img/svg/gitlab.svg';

const BitbucketIcon = () => (
  <SvgIcon component={BitbucketIconSvg} viewBox="0 0 80 80" />
);

const GitlabIcon = () => (
  <SvgIcon component={GitlabIconSvg} viewBox="0 0 586 559" />
);

export {
  BitbucketIcon,
  GitlabIcon
}