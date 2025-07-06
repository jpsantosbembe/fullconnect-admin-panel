// assets
import { IconFileAnalytics, IconMailCode, IconDeviceDesktopAnalytics, IconSettingsCog, IconMailPlus} from '@tabler/icons-react';

// constant
const icons = {
  IconFileAnalytics,
  IconMailCode,
  IconDeviceDesktopAnalytics,
  IconSettingsCog,
  IconMailPlus
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const system = {
  id: 'system',
  title: 'Sistema',
  type: 'group',
  children: [
    {
      id: 'log',
      title: 'Monitoramento',
      type: 'collapse',
      icon: icons.IconDeviceDesktopAnalytics,
      children: [
        {
          id: 'log-list',
          title: 'Logs de auditoria',
          type: 'item',
          icon: icons.IconFileAnalytics,
          url: '/log/list',
        },
      ]
    },
    {
      id: 'settings',
      title: 'Configurações',
      type: 'collapse',
      icon: icons.IconSettingsCog,
      children: [
        {
          id: 'settings-email-list',
          title: 'Listar modelos de E-mail',
          type: 'item',
          icon: icons.IconMailCode,
          url: '/settings/email/list',
        },
        {
          id: 'settings-email-new',
          title: 'Criar novo modelo de E-mail',
          type: 'item',
          icon: icons.IconMailPlus,
          url: '/settings/email/new',
        },
      ]
    }
  ]
};

export default system;
