import {client,Channel} from "../utils/wopan";


client.setToken("06e36053-22d5-49f9-ad51-291bbcfeb7e3","f70989e5-f646-4609-846f-1146315cd038")
client.psToken = '0afe67b5-7c4f-4c9c-96f0-0087fe7935b4'
//QueryAllFiles(SpaceType.Private, '0', 0, 20, SortType.NameAsc, '').then (r =>console.log(r))
console.log(await client.decrypt('mKgEHxRYSIR46jBWbbsHXJW+qEZENumJtkO/US+zoi2ZkKgoTOobAyRkw83YewcRnDbH+sltf9keFM5iv4y7yIQuv6mpR34p7WPPf45vI6rInLrIfAM0y47WUJdUaE2i8XxpFiAZ74W68GrWoU5YsCFJ/QjJ9kCHDCzrvuec76bVSBuIz0RfX+aE3JxAmXJhd4ISD7HAk8DmbkOuAu/XTbAFy97mSlxyc7PCO5y3jqCPfSkDUWXi1jt5u6lMCe+6'))
console.log(await client.decrypt('OjHk9GsBsalwQPFeiKSeIjR/YmcNedfqBh+sLtedeeRYEOPqHLsKX9gLY1KSfftnVi7/AJ1jj3L1MvcAUEaljDQqBoBIiT6g7Eiw7h7uvd0/VTtNxVQ0JbwHGZTPN751',Channel.APIUser))