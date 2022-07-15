---
id: Masthead
beta: true
section: components
wrapperTag: div
---## Examples

### Basic

```html
<header class="pf-c-masthead" id="basic-masthead">
  <span class="pf-c-masthead__toggle">
    <button
      class="pf-c-button pf-m-plain"
      type="button"
      aria-label="Global navigation"
    >
      <i class="fas fa-bars" aria-hidden="true"></i>
    </button>
  </span>
  <div class="pf-c-masthead__main">
    <a class="pf-c-masthead__brand" href="#">
      <picture
        class="pf-c-brand pf-m-picture"
        style="--pf-c-brand--Width: 180px; --pf-c-brand--Width-on-md: 180px; --pf-c-brand--Width-on-2xl: 220px;"
      >
        <source
          media="(min-width: 768px)"
          srcset="/assets/images/logo__pf--reverse-on-md.svg"
        />
        <source srcset="/assets/images/logo__pf--reverse--base.svg" />
        <img
          src="/assets/images/logo__pf--reverse--base.png"
          alt="Fallback patternFly default logo"
        />
      </picture>
    </a>
  </div>
  <div class="pf-c-masthead__content">
    <div class="pf-c-toolbar">
      <div class="pf-c-toolbar__content-section">
        <div class="pf-c-toolbar__item">
          <div class="pf-c-context-selector pf-m-expanded pf-m-full-height">
            <span
              id="context-selector-collapsed-example-label"
              hidden
            >Selected project:</span>
            <button
              class="pf-c-context-selector__toggle"
              aria-expanded="true"
              id="context-selector-collapsed-example-toggle"
              aria-labelledby="context-selector-collapsed-example-label context-selector-collapsed-example-toggle"
            >
              <span class="pf-c-context-selector__toggle-text">Context selector</span>
              <span class="pf-c-context-selector__toggle-icon">
                <i class="fas fa-caret-down" aria-hidden="true"></i>
              </span>
            </button>
            <div class="pf-c-context-selector__menu">
              <div class="pf-c-context-selector__menu-search">
                <div class="pf-c-input-group">
                  <input
                    class="pf-c-form-control"
                    type="search"
                    placeholder="Search"
                    id="textInput1"
                    name="textInput1"
                    aria-labelledby="context-selector-collapsed-example-search-button"
                  />
                  <button
                    class="pf-c-button pf-m-control"
                    type="button"
                    id="context-selector-collapsed-example-search-button"
                    aria-label="Search menu items"
                  >
                    <i class="fas fa-search" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
              <ul class="pf-c-context-selector__menu-list">
                <li>
                  <a class="pf-c-context-selector__menu-list-item" href="#">Link</a>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                  >Action</button>
                </li>
                <li>
                  <a
                    class="pf-c-context-selector__menu-list-item pf-m-disabled"
                    href="#"
                    aria-disabled="true"
                    tabindex="-1"
                  >Disabled link</a>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                    disabled
                  >Disabled action</button>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                  >My project</button>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                  >OpenShift cluster</button>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                  >Production Ansible</button>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                  >AWS</button>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                  >Azure</button>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                  >My project</button>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                  >OpenShift cluster</button>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                  >Production Ansible</button>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                  >AWS</button>
                </li>
                <li>
                  <button
                    class="pf-c-context-selector__menu-list-item"
                    type="button"
                  >Azure</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="pf-c-toolbar__group pf-m-align-right">
          <div class="pf-c-toolbar__item pf-m-hidden pf-m-visible-on-lg">
            <div class="pf-c-dropdown pf-m-expanded pf-m-full-height">
              <button
                class="pf-c-dropdown__toggle"
                id="dropdown-expanded-button"
                aria-expanded="true"
                type="button"
              >
                <span class="pf-c-dropdown__toggle-text">Expanded dropdown</span>
                <span class="pf-c-dropdown__toggle-icon">
                  <i class="fas fa-caret-down" aria-hidden="true"></i>
                </span>
              </button>
              <ul
                class="pf-c-dropdown__menu"
                aria-labelledby="dropdown-expanded-button"
              >
                <li>
                  <a class="pf-c-dropdown__menu-item" href="#">Link</a>
                </li>
                <li>
                  <button class="pf-c-dropdown__menu-item" type="button">Action</button>
                </li>
                <li>
                  <a
                    class="pf-c-dropdown__menu-item pf-m-disabled"
                    href="#"
                    aria-disabled="true"
                    tabindex="-1"
                  >Disabled link</a>
                </li>
                <li>
                  <button
                    class="pf-c-dropdown__menu-item"
                    type="button"
                    disabled
                  >Disabled action</button>
                </li>
                <li class="pf-c-divider" role="separator"></li>
                <li>
                  <a class="pf-c-dropdown__menu-item" href="#">Separated link</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="pf-c-toolbar__item">
            <div class="pf-c-dropdown">
              <button
                class="pf-c-dropdown__toggle pf-m-plain"
                id="basic-masthead-header-action-button"
                aria-expanded="false"
                type="button"
                aria-label="Actions"
              >
                <i class="fas fa-ellipsis-v" aria-hidden="true"></i>
              </button>
              <ul
                class="pf-c-dropdown__menu pf-m-align-right"
                aria-labelledby="basic-masthead-header-action-button"
                hidden
              >
                <li>
                  <a class="pf-c-dropdown__menu-item" href="#">Link</a>
                </li>
                <li>
                  <button class="pf-c-dropdown__menu-item" type="button">Action</button>
                </li>
                <li>
                  <a
                    class="pf-c-dropdown__menu-item pf-m-disabled"
                    href="#"
                    aria-disabled="true"
                    tabindex="-1"
                  >Disabled link</a>
                </li>
                <li>
                  <button
                    class="pf-c-dropdown__menu-item"
                    type="button"
                    disabled
                  >Disabled action</button>
                </li>
                <li class="pf-c-divider" role="separator"></li>
                <li>
                  <a class="pf-c-dropdown__menu-item" href="#">Separated link</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- <div class="pf-c-toolbar__group pf-m-toggle-group pf-m-show"
          >
            
                      <div class="pf-c-toolbar__toggle"
                      >
                      <button class="pf-c-button pf-m-plain"
                          type="button"
                            aria-label="Show filters" aria-expanded="false" aria-controls="-expandable-content"
                        >
                              <i class="fas fa-filter" aria-hidden="true"></i>
                      </button>
                      </div>
                    </div>
        -->
      </div>
    </div>
  </div>
</header>

```
