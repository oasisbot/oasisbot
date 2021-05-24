import React from 'react'
import * as common from '../../../common'

export default function Polls() {
    React.useEffect(() => {
        const fun = async () => {
            let result = await fetch(`/api/plugins/polls?id=${common.GetDashboardID()}`)

            let data = await result.body?.getReader().read()
            if (!data) return
            // const commands = JSON.parse(new TextDecoder().decode(data.value)) as Command[]
            // setCommands(commands)
        }
        fun()
    }, [])
    return <></>
}