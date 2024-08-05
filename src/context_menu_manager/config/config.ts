import { MenuItemProperties } from '../model/MenuItem';

export interface ContextMenuManagerConfig {
  /**
   * Default command list
   */
  menuItems?: MenuItemProperties[];

  /**
   * Style prefix.
   * @default 'sm-'
   */
  stylePrefix?: string;

  /**
   * Avoid rendering the default command palette.
   * @default false
   */
  custom?: boolean;
}

export default {
  menuItems: [
    {
      text: 'Wrap Components',
      condition: editor => {
        const selectedComponents = editor.getSelectedAll();
        const parent = selectedComponents[0]?.parent();
        if (selectedComponents.length < 2 || !parent) return false;
        const haveSameParent = selectedComponents.every(component => {
          return component.parent() === parent;
        });
        return haveSameParent;
      },
      action: editor => {
        const selectedComponents = editor.getSelectedAll().sort((a, b) => a.index() - b.index());
        const parent = selectedComponents[0]?.parent();
        const at = selectedComponents[0].index();
        if (!parent) return;

        const newDiv = parent.components().add(
          {
            type: 'div',
            style: {
              display: 'flex',
              flexDirection: 'column',
            },
          },
          {
            at,
          }
        );
        selectedComponents.forEach(component => newDiv.append(component));
      },
    },
    {
      text: 'Edit text',
      condition: editor => {
        const component = editor.Editor.getSelected();
        return component?.attributes.type === 'text';
      },
      action: editor => {
        editor.Editor.getSelected()?.trigger('focus');
      },
    },
    {
      text: 'Select All',
      condition: () => {
        return true;
      },
      action: editor => {
        const component = editor.Editor.getWrapper();
        editor.Editor.select(component);
      },
      shortcut: 'ctrl+a',
    },
    {
      text: 'Copy',
      condition: editor => {
        return editor.getSelectedAll().length > 0;
      },
      action: editor => {
        editor.Editor.runCommand('core:copy');
      },
      shortcut: 'ctrl+c',
    },
    {
      text: 'Paste',
      condition: editor => {
        return true;
      },
      action: editor => {
        editor.Editor.runCommand('core:paste');
      },
      shortcut: 'ctrl+v',
    },
    {
      text: 'Delete',
      condition: editor => {
        return editor.getSelectedAll().length > 0;
      },
      action: editor => {
        const selectedComponents = editor.getSelectedAll();
        selectedComponents.forEach(comp => comp.remove());
      },
      shortcut: 'delete',
    },
    {
      text: 'Components',
      condition: editor => {
        return true;
      },
      children: [
        {
          text: 'Add Text Component',
          condition: editor => {
            return true;
          },
          action: editor => {
            editor.Editor.getSelected()?.components().add({
              type: 'text',
              content: 'New Text Component',
            });
          },
        },
        {
          text: 'Add Image Component',
          condition: editor => {
            return true;
          },
          action: editor => {
            editor.Editor.getSelected()?.components().add({
              type: 'image',
              src: 'https://via.placeholder.com/150',
            });
          },
        },
        {
          text: 'Clear Canvas',
          condition: editor => {
            return editor.Editor.getComponents().length > 0;
          },
          action: editor => {
            editor.Editor.runCommand('core:canvas-clear');
          },
        },
      ],
    },
  ],
} as ContextMenuManagerConfig;
