export default function FormCheckbox({id, label, defaultChecked}) {
    return <tr>
        <th><label htmlFor={id}>{label}:</label></th>
        <td><input type="checkbox" name={id} id={id} defaultChecked={defaultChecked}/></td>
    </tr>
}