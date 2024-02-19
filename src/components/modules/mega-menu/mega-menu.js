/* global menuData */
import register from 'preact-custom-element'
import { Fragment } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { handleize, select, selectAll, removeClass, addClass, on } from 'helpers/dom'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import useDetectBreakpoint from 'uses/useDetectBreakpoint'
import Icon from 'snippets/icon/icon'
import './mega-menu.css'
import { map } from '@/components/helpers/utils'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

const selectors = {
  activeClass: 'active',
  menuTriggerClass: '.js-menu-trigger',
  menuItemClass: '.js-menu-item',
  subActive: 'active-sub',
  megaMenuInner: '.mega-menu-inner',
  delayTime: 300
}

function MegaMenu () {
  const megaMenuRef = useRef(null)
  const megaMenuInnerRef = useRef(null)
  const [mainMenu, setMainMenu] = useState([])
  const [compileData, setCompileData] = useState([])
  const [hovered, setHovered] = useState(false)
  const [positionLeft, setPositionLeft] = useState(0)

  const { isMobile } = useDetectBreakpoint()
  const menuItems = selectAll(selectors.menuItemClass)

  const closeMegaMenu = () => {
    if (!megaMenuRef.current) {
      return
    }
    closeAllMenuSubPanels()
    removeClass(selectors.activeClass, megaMenuRef.current)
    // removeClass(selectors.activeClass, menuItems)
    clearAllBodyScrollLocks()
  }

  const openMegaMenu = () => {
    if (!megaMenuRef.current) {
      return
    }
    addClass(selectors.activeClass, megaMenuRef.current)
    disableBodyScroll(megaMenuInnerRef.current)
  }

  const addEventMegaMenuDesktop = () => {
    if (isMobile || !megaMenuRef.current) {
      return
    }
    on('mouseenter', (e) => {
      setHovered(true)
    }, megaMenuRef.current)
    on('mouseleave', (e) => {
      setHovered(false)
    }, megaMenuRef.current)
  }

  const addEventMegaMenu = () => {
    const menuTrigger = selectAll(selectors.menuTriggerClass)
    menuTrigger.forEach(item => {
      item.addEventListener('click', openMegaMenu)
    })
    addEventMegaMenuDesktop()
  }

  const setDataMenu = () => {
    const compileDataChildren = menuData?.mainMenu.children.map(item => (
      {
        ...item,
        children: [
          ...item.children,
          ...menuData?.blocks.find(block => handleize(block.title) === handleize(item.title))?.menu || []
        ]
      }
    ))
    const _compileData = {
      ...menuData?.mainMenu,
      children: compileDataChildren
    }
    const _mainMenu = menuData?.settings.hideLevel1 ? _compileData.children.find(menu => menu.children.length > 0) : _compileData
    setMainMenu(_mainMenu)
    setCompileData(_compileData)
  }

  const handleMegaMenu = () => {
    if (hovered) {
      openMegaMenu()
    } else {
      closeMegaMenu()
    }
  }

  useEffect(() => {
    setDataMenu()
  }, [])

  useEffect(() => {
    addEventMegaMenu()
    if (isMobile || compileData?.children?.length === undefined) {
      return
    }
    compileData?.children.forEach(item => {
      if (item?.children.length > 0) {
        const menuItem = select(`.js-menu-item[data-title="${handleize(item.title)}"]`)
        on('mouseenter', (e) => {
          removeClass(selectors.activeClass, menuItems)
          addClass(selectors.activeClass, menuItem)
          setMainMenu(item)
          setHovered(true)
          setPositionLeft(e.target.getBoundingClientRect().left)
        }, menuItem)
        on('mouseleave', (e) => {
          setHovered(false)
        }, menuItem)
      }
    })
  }, [compileData])

  useEffect(() => {
    if (hovered) {
      removeClass(selectors.activeClass, menuItems)
    }
    const timer = setTimeout(handleMegaMenu, selectors.delayTime)
    return () => {
      clearTimeout(timer)
    }
  }, [hovered])

  return mainMenu?.children?.length > 0 && (
    <div ref={megaMenuRef} className="mega-menu" style={`--position-left: ${positionLeft}px`}>
      <div className="mega-menu-overlay" onclick={closeMegaMenu}></div>
      <button onclick={closeMegaMenu} aria-label="Close Mega Menu" className='absolute right-[328px] z-50 top-2 hidden [.active_&]:block lg:[.active_&]:hidden'>
        <Icon name="icon-close-circle-outline" viewBox="0 0 40 40" className='w-10 h-10 text-white' />
      </button>
      <div className="container mega-menu-container">
        <div ref={megaMenuInnerRef} className={`mega-menu-inner ${mainMenu?.children?.length > 8 ? 'scrollbar-custom-wrapper' : 'lg:!h-fit'}`}>
          {menuData?.settings?.ctaText &&
            menuData?.settings?.ctaLink && (
              <a href={menuData?.settings?.ctaLink} className="mx-5 mt-5 text-sm font-bold button-primary flex-center font-body lg:hidden">
                <Icon name="icon-login" viewBox="0 0 20 20" className="w-5 h-5 mr-2 text-accent-1" />
                {menuData?.settings?.ctaText}
              </a>
          )}
          <div className={`w-full h-full bg-white lg-max:my-6 ${mainMenu?.children?.length > 8 ? 'scrollbar-custom' : ''}`}>
            <div className={`w-full h-full  ${mainMenu?.children?.length > 8 ? 'scrollbar-custom-inner' : ''}`}>
              {mainMenu?.children?.map((item, index) => item && (
                <MenuSubItem settings={menuData?.settings} item={item} key={index} />
              ))}
            </div>
          </div>
          <MenuSecondary />
        </div>
      </div>
    </div>
  )
}

function MenuSubItem ({ settings, item }) {
  const type = settings?.type[`level${item.level}`]

  const renderMenuSubItem = (item) => {
    switch (type) {
      case 'panel':
        return <MenuSubPanel settings={settings} item={item} />
      case 'accordion':
        return <MenuSubAccordion settings={settings} item={item} />
      default:
        return <MenuSubPanel settings={settings} item={item} />
    }
  }

  return item?.children.length === 0 ? (
    <a
      className="menu-sub-title"
      href={item.url}
    >
      {item.title}
    </a>
  ) : renderMenuSubItem(item)
}

function closeAllMenuSubPanels (level = 1) {
  while (level < 3) {
    const menuSubPanels = selectAll(`.js-menu-sub-panel[data-level="${level}"]`)
    const btnOpenSubMenu = selectAll(`.js-button-open-sub-menu[data-level="${level}"]`)
    btnOpenSubMenu.forEach(btn => btn && btn.classList.remove(selectors.subActive))
    menuSubPanels.forEach(panel => panel && panel.classList.remove(selectors.activeClass))
    level++
  }
  clearAllBodyScrollLocks()
}

function MenuSubPanel ({ settings, item }) {
  const panelRef = useRef(null)
  const panelInnerRef = useRef(null)
  const toggle = (e) => {
    e.preventDefault()
    const isActive = panelRef.current.classList.contains(selectors.activeClass)
    closeAllMenuSubPanels(item.level)
    if (!isActive) {
      addClass(selectors.activeClass, panelRef.current)
      addClass(selectors.subActive, e.target)
      disableBodyScroll(panelInnerRef.current)
    } else {
      removeClass(selectors.activeClass, panelRef.current)
      removeClass(selectors.subActive, e.target)
      clearAllBodyScrollLocks()

      if (item.level === 1) {
        const mainPanel = select(selectors.megaMenuInner)
        disableBodyScroll(mainPanel)
      } else if (item.level > 1) {
        const prevLevel = item.level - 1
        const selectorPanelLevel = '.menu-sub-panel-inner-' + prevLevel
        const subPanelLevel = selectAll(selectorPanelLevel)
        console.log(subPanelLevel)
        map(disableBodyScroll, [...subPanelLevel])
      }
    }
  }

  return (
    <Fragment>
      <button className="menu-sub-title js-button-open-sub-menu" data-level={item.level} onclick={toggle}>
        {item.title}
        <Icon viewBox="0 0 20 20" name="icon-chevron-forward-outline-thin" className="flex-shrink-0 w-5 h-5 text-primary" />
      </button>
      <div ref={panelRef} className={`menu-sub-panel menu-sub-panel-${item.level} js-menu-sub-panel`} data-level={item.level}>
        <div className="container menu-sub-panel-container">
          <div ref={panelInnerRef} className={`menu-sub-panel-inner menu-sub-panel-inner-${item.level} ${item.children.length > 8 ? 'scrollbar-custom-wrapper' : 'lg:!h-fit'}`}>
            <div className="menu-sub-panel-heading">
              <button className="menu-sub-panel-back" onclick={toggle}>
                <Icon viewBox="0 0 20 20" name="icon-chevron-forward-outline-thin" className="w-5 h-5 rotate-180 text-primary" />
              </button>
              <div className="menu-sub-panel-title">{item.title}</div>
            </div>
            <div className={`menu-sub-panel-content ${item.children.length > 8 ? 'scrollbar-custom' : ''}`}>
              <div className={`menu-sub-panel-content-inner ${item.children.length > 8 ? ' scrollbar-custom-inner' : ''}`}>
                {item?.countCollection && (
                  <a
                  className="menu-sub-title menu-sub-title-view-all"
                  href={item.url}
                >
                  View All {item.title}
                  <span>
                    <span className="lg:hidden ml-0.5">(</span>
                    {item?.countCollection}
                    <span className="lg:hidden">)</span>
                  </span>
                </a>
                )}
                {item?.children.map((item, index) => (
                  <MenuSubItem settings={settings} item={item} key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

function MenuSubAccordion ({ settings, item }) {
  return (
    <Fragment>
      <div className="menu-sub-title">
        {item.title}
      </div>
      <div className="">MenuSubAccordion</div>
    </Fragment>
  )
}

function MenuSecondary () {
  const menuSecondary = menuData?.secondMenu.map(menu => {
    const titleArr = menu.title.split('] ')
    const iconName = titleArr[0].replace('[', '')
    const title = titleArr[1]
    return {
      iconName,
      title,
      url: menu.url
    }
  })
  return (
    menuData?.secondMenu && menuData?.secondMenu.length > 0 && (
      <div className="px-5 py-6 mt-auto bg-grey-100 lg:hidden">
        {menuSecondary.map(menu => (
          <a className="flex items-center mb-4 text-sm text-grey-900 last:mb-0">
            <Icon viewBox="0 0 21 20" name={menu.iconName} className="w-5 h-5 mr-3 text-secondary" />
            {menu.title}
          </a>
        ))}
      </div>
    )
  )
}

register(MegaMenu, 'mega-menu')
