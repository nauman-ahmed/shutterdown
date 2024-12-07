import React, { useState } from 'react'
import { MenuItem, SubMenu } from 'react-pro-sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOpenedMenu } from '../../config/zStore';
import Cookies from "js-cookie"

export default function MenuOption({ option }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { openedMenu, setOpenedMenu } = useOpenedMenu()

    return (
        <>
            {option.path ?
                <MenuItem
                    icon={option.icon(location.pathname.startsWith(option.path))}
                    onClick={() => {
                        navigate(option.path);
                        setOpenedMenu(null)
                        Cookies.set('currentTab', option.text)
                    }}
                    className={
                        location.pathname.startsWith(option.path)
                            ? "active active_color"
                            : ""
                    }
                >
                    {option.text}
                </MenuItem>
                :
                <SubMenu
                    className={
                        option.subMenus?.some(subOption => subOption.path == location.pathname) || openedMenu === option.text || option.subMenus.some(subOption => subOption.text === Cookies.get('currentTab'))
                            ? "active"
                            : ""
                    }
                    icon={option.icon(option.subMenus?.some(subOption => subOption.path == location.pathname) || openedMenu === option.text) || option.subMenus.some(subOption => subOption.text === Cookies.get('currentTab'))}
                    title={option.text}
                    onOpenChange={() => setOpenedMenu(option.text)}
                    open={openedMenu === option.text || option.subMenus.some(subOption => subOption.text === Cookies.get('currentTab'))}
                >

                    {option.subMenus?.map(subOption => <MenuItem
                        onClick={() => {
                            Cookies.set('currentTab', subOption.text);
                            navigate(subOption.path)
                        }}
                        className={
                            location.pathname.startsWith(subOption.path) || Cookies.get('currentTab') === subOption.text
                                ? "active_submenu"
                                : ""
                        }
                    >
                        <span className='me-2'>◯</span> {subOption.text}
                    </MenuItem>)}
                </SubMenu>
            }
        </>
    )
}
