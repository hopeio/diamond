import {client,Channel} from "@/utils/wopan";


client.setToken("317b62c5-dd0c-454a-8069-2a806430652e","f70989e5-f646-4609-846f-1146315cd038")
client.psToken = 'b87bc188-e345-4892-8024-2600ef578ea7'
//QueryAllFiles(SpaceType.Private, '0', 0, 20, SortType.NameAsc, '').then (r =>console.log(r))
//console.log(client.decrypt('a7M2bqu+IzlOeidFG4iADhAxvOvGBfdtCOBjK7RvgSDrLKpkZaEzH/AuMGBFZ54xHtr0vnImtT4/NDG2EVZ4Umvicb93x3L+5OYAAvsgNw8IFNw0w4F6HDR/9h7jSU8b+MYk3M/GdC/lhrraeaqUxvx1TbEu8EXPiHyrarHK+ZDNMKRZAmOv+EM2gebWKsqwyQmowit/bpeJ0oUzFUTA0I8TcE3Rexw0XopxVBnSUsRHQ1FiPh78BNo5XXb5Pzu4'))
console.log(await client.decrypt('OjHk9GsBsalwQPFeiKSeIjR/YmcNedfqBh+sLtedeeRYEOPqHLsKX9gLY1KSfftnVi7/AJ1jj3L1MvcAUEaljDQqBoBIiT6g7Eiw7h7uvd0/VTtNxVQ0JbwHGZTPN751',Channel.APIUser))