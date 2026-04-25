import { CatalogItem } from "../CatalogItem/CatalogItem";

export function CatalogList(props) {
  
    const list = [
        {label: "Test", price: 555},
        {label: "Test1", price: 523}
    ]
  
  return (<>{
    list.map((item) => <CatalogItem />)
  }</>)

}