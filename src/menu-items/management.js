// assets
import { IconUsers, IconUser, IconUserPlus, IconList } from '@tabler/icons-react';

// constant
const icons = {
  IconUsers,
  IconUser,
  IconUserPlus,
  IconList,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const management = {
  id: 'management',
  title: 'Gestão',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Usuários',
      type: 'collapse',
      icon: icons.IconUsers,
      children: [
        {
          id: 'users-list',
          title: 'Listar todos',
          type: 'item',
          icon: icons.IconList,
          url: '/users/list',
        },
        {
          id: 'users-add',
          title: 'Adicionar novo',
          type: 'item',
          icon: icons.IconUserPlus,
          url: '/users/add',
        }
      ]
    }
  ]
};

export default management;
