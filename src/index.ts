import { bot } from '@/config'
import { handleCommands } from '@/utils/cmdhandler'
import '@/keep_alive'

handleCommands(bot);