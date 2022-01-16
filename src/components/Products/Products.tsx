import React, { useEffect, useState } from 'react';
import { Box, TableCell } from '@mui/material';
import { useApi } from '../../hooks/useApi';
import DashboardTable from '../dashboard/DashboardTable';
import useUpdateEffect from '../../hooks/useUpdateEffect'
import DashboardContent from '../dashboard/DashboardContent';
import { Column } from '../../utils/types';

const headCells:Column[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'category',
    numeric: true,
    disablePadding: false,
    label: 'Category',
  },
];

export type DisplayProduct = {
  id: string,
  name: string,
  cover: string,
  price: number,
  category: 'men' | 'women' | 'sneaker' | 'hat' | 'jacket'
}

const Products = () => {
  const [data, setData] = useState<DisplayProduct[] | null>(null)
  const [total, setTotal] = useState(0);
  const { Fetch } = useApi()
  const [selected, setSelected] = useState<string[]>([] as string[]);

  //// PAGINATION ////
  const [page, setPage] = useState<number>(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  ////////////////////

  const deleteItems = () => {
    Fetch("/v1/bo/products/remove", "PATCH", {tab: selected}, true)
      .then(res => res?.success && setSelected([]))
      .then(() => listItem())
  }
  const listItem = () => {
    Fetch(`/v1/bo/products/${page*rowsPerPage}/${rowsPerPage}?direction=${order}&field=${orderBy}`)
      .then(res => {
        if (res?.success && res.success && res.products && res.products.length > 0) {
          setData(res.products)
          setTotal(res.count)
        }
      })
  }

  useUpdateEffect(() => {
    listItem()
  }, [rowsPerPage, page, order, orderBy])

  useEffect(() => {
    listItem()
    return () => setData(null)
    // eslint-disable-next-line
  }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <DashboardTable
        add="/products/add"
        deleteItems={deleteItems}
        order={order}
        total={total}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        setPage={setPage}
        setOrder={setOrder}
        selected={selected}
        setSelected={setSelected}
        data={data}
        headCells={headCells}
      >
        {data && data?.length > 0 && data?.map((row:DisplayProduct, index:number) => {
            return (
              <DashboardContent
                selected={selected}
                setSelected={setSelected} 
                row={row}
                key={row.id}
                isItemSelected={selected.indexOf(row.id) !== -1}
                labelId={`checkbox-${index}`}
                edit={`/products/edit/${row.id}`}
              >

                <TableCell component="th" id={`checkbox-${index}`} scope="row" padding="none">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{row.category}</TableCell>

              </DashboardContent>
            );
        })}
      </DashboardTable>
    </Box>
  );
}

export default Products