import EditorModel from '../editor/model/Editor';
import Menu from './model/MenuItems';
import MenuItem from './model/MenuItem';
import { ContextMenuManagerConfig } from './types';
import MenuItemsView from './view/MenuItemsView';
import MenuItems from './model/MenuItems';
import { ItemManagerModule } from '../abstract/Module';
import defaults from './config/config';
import Component from '../dom_components/model/Component';

export default class ContextMenuManager extends ItemManagerModule<
  ContextMenuManagerConfig,
  /** @ts-ignore */
  MenuItems
> {
  storageKey = '';
  menuItems: MenuItems;
  menuItemView: MenuItemsView;

  constructor(em: EditorModel) {
    const defaultContextMenu = new MenuItems(
      [
        new MenuItem({
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
        }),
        new MenuItem({
          text: 'Edit text',
          condition: editor => {
            const component = editor.Editor.getSelected();
            return component?.attributes.type === 'text';
          },
          action: editor => {
            editor.Editor.getSelected()?.trigger('focus');
          },
        }),
        new MenuItem({
          text: 'Select All',
          condition: () => {
            return true;
          },
          action: editor => {
            const component = editor.Editor.getWrapper();
            editor.Editor.select(component);
          },
          shortcut: 'ctrl+a',
        }),
        new MenuItem({
          text: 'Copy',
          condition: editor => {
            return editor.getSelectedAll().length > 0;
          },
          action: editor => {
            editor.Editor.runCommand('core:copy');
          },
          shortcut: 'ctrl+c',
        }),
        new MenuItem({
          text: 'Paste',
          condition: editor => {
            return true;
          },
          action: editor => {
            editor.Editor.runCommand('core:paste');
          },
          shortcut: 'ctrl+v',
        }),
        new MenuItem({
          text: 'Delete',
          condition: editor => {
            return editor.getSelectedAll().length > 0;
          },
          action: editor => {
            const selectedComponents = editor.getSelectedAll();
            selectedComponents.forEach(comp => comp.remove());
          },
          shortcut: 'delete',
        }),
        new MenuItem({
          text: 'Components',
          condition: editor => {
            return true;
          },
          children: [
            new MenuItem({
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
            }),
            new MenuItem({
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
            }),
            new MenuItem({
              text: 'Clear Canvas',
              condition: editor => {
                return editor.Editor.getComponents().length > 0;
              },
              action: editor => {
                editor.Editor.runCommand('core:canvas-clear');
              },
            }),
          ],
        }),
      ],
      {
        em,
      }
    );
    super(em, 'ContextMenuManager', defaultContextMenu, {}, defaults);

    this.model = new Menu();
    this.menuItems = this.all || [];
    this.menuItemView = new MenuItemsView({
      collection: this.menuItems,
      em: this.em,
    });
    this.em.on('canvas:contextmenu:close', this.close, this);
    this.em.on('canvas:contextmenu', this.open, this);
    this.em.on('component:select', () => {
      this.em.trigger('canvas:contextmenu:close');
    });
    return this;
  }

  renderMenu = () => {
    if (!this.menuItemView) {
      this.menuItemView = new MenuItemsView({
        collection: this.menuItems,
        em: this.em,
      });
    }
    const el = this.menuItemView.render().el;
    el.classList.add('context-menu');
    document.body.appendChild(el);
  };

  destroy() {
    this.menuItemView?.remove();
  }

  open(component: Component, event: PointerEvent) {
    if (this.menuItemView) {
      this.menuItemView.remove();
    }
    const position = {
      top: event.y,
      left: event.x,
    };
    this.menuItems.position = position;
    this.menuItemView = new MenuItemsView({
      collection: this.menuItems,
      em: this.em,
    });
    this.renderMenu();
  }

  close() {
    this.menuItemView && this.menuItemView.remove();
  }
}
