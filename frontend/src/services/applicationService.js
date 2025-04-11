import { APPLICATION_TEMPLATE_VERSIONS } from '@/utils/constants';

export default {
  getActiveApplicationTemplate() {
    const activeApplicationTemplate = APPLICATION_TEMPLATE_VERSIONS.find((template) => template.isActive);
    return activeApplicationTemplate?.id;
  },
};
