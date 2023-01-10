import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HoC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import {
  Spinner,
  Pagination,
  Message,
  Confirm,
  Search,
  Meta,
} from '../../components'
import {
  DynamicFormProps,
  inputNumber,
  inputTel,
  inputText,
  staticInputSelect,
} from '../../utils/dForms'
import FormView from '../../components/FormView'
import { FaCheckCircle, FaPenAlt, FaTimesCircle, FaTrash } from 'react-icons/fa'
import apiHook from '../../api'
import { ISupplier } from '../../models/Supplier'
import { currency } from '../../utils/currency'

const Suppliers = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['suppliers'],
    method: 'GET',
    url: `setting/suppliers?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const postApi = apiHook({
    key: ['suppliers'],
    method: 'POST',
    url: `setting/suppliers`,
  })?.post

  const updateApi = apiHook({
    key: ['suppliers'],
    method: 'PUT',
    url: `setting/suppliers`,
  })?.put

  const deleteApi = apiHook({
    key: ['suppliers'],
    method: 'DELETE',
    url: `setting/suppliers`,
  })?.deleteObj

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({})

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess)
      formCleanHandler()
    getApi?.refetch()
    document.getElementById('dismissModal')?.click()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const editHandler = (item: ISupplier) => {
    setId(item._id)
    setValue('name', item?.name)
    setValue('phone', item?.phone)
    setValue('address', item?.address)
    setValue('openingBalance', item?.openingBalance)
    setValue('business', item?.business)
    setValue('warehouse', item?.warehouse)
    setValue('status', item?.status)

    setEdit(true)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Suppliers List'
  const label = 'Supplier'
  const modal = 'supplier'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
  }

  const submitHandler = (data: object) => {
    edit
      ? updateApi?.mutateAsync({
          _id: id,
          ...data,
        })
      : postApi?.mutateAsync(data)
  }

  const form = [
    <div key={0} className="col-md-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Contact Person',
        name: 'name',
        placeholder: 'Enter contact person name',
      } as DynamicFormProps)}
    </div>,
    <div key={1} className="col-md-6 col-12">
      {inputTel({
        register,
        errors,
        label: 'Phone',
        name: 'phone',
        placeholder: 'Enter phone',
      } as DynamicFormProps)}
    </div>,
    <div key={3} className="col-md-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Business Name',
        name: 'business',
        placeholder: 'Enter business name',
      } as DynamicFormProps)}
    </div>,
    <div key={4} className="col-md-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Warehouse',
        name: 'warehouse',
        placeholder: 'Enter warehouse',
      } as DynamicFormProps)}
    </div>,
    <div key={5} className="col-md-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Address',
        name: 'address',
        placeholder: 'Enter address',
      } as DynamicFormProps)}
    </div>,
    <div key={6} className="col-md-6 col-12">
      {inputNumber({
        register,
        errors,
        label: 'Opening Balance',
        name: 'openingBalance',
        placeholder: 'Enter opening balance',
      } as DynamicFormProps)}
    </div>,
    <div key={7} className="col-md-6 col-12">
      {staticInputSelect({
        register,
        errors,
        label: 'Status',
        name: 'status',
        placeholder: 'Select status',
        data: [{ name: 'active' }, { name: 'disabled' }],
      } as DynamicFormProps)}
    </div>,
  ]

  const modalSize = 'modal-md'

  return (
    <>
      <Meta title="Suppliers" />

      {deleteApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been deleted successfully.`}
        />
      )}
      {deleteApi?.isError && (
        <Message variant="danger" value={deleteApi?.error} />
      )}
      {updateApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been updated successfully.`}
        />
      )}
      {updateApi?.isError && (
        <Message variant="danger" value={updateApi?.error} />
      )}
      {postApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been Created successfully.`}
        />
      )}
      {postApi?.isError && <Message variant="danger" value={postApi?.error} />}

      <div className="ms-auto text-end">
        <Pagination data={getApi?.data} setPage={setPage} />
      </div>

      <FormView
        edit={edit}
        formCleanHandler={formCleanHandler}
        form={form}
        isLoadingUpdate={updateApi?.isLoading}
        isLoadingPost={postApi?.isLoading}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={label}
        modalSize={modalSize}
      />

      {getApi?.isLoading ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant="danger" value={getApi?.error} />
      ) : (
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h3 className="fw-light text-muted">
              {name}
              <sup className="fs-6"> [{getApi?.data?.total}] </sup>
            </h3>
            <button
              className="btn btn-outline-primary btn-sm shadow my-2"
              data-bs-toggle="modal"
              data-bs-target={`#${modal}`}
            >
              Add New {label}
            </button>
            <div className="col-auto">
              <Search
                placeholder="Search by supplier name"
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Business Name</th>
                <th>Warehouse</th>
                <th>Address</th>
                <th>Opening Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: ISupplier, i: number) => (
                <tr key={i}>
                  <td>{item?.name}</td>
                  <td>{item?.phone}</td>
                  <td>{item?.business}</td>
                  <td>{item?.warehouse}</td>
                  <td>{item?.address}</td>
                  <td>{currency(item?.openingBalance)}</td>
                  <td>
                    {item?.status === 'active' ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaTimesCircle className="text-danger" />
                    )}
                  </td>

                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-primary btn-sm rounded-pill"
                        onClick={() => editHandler(item)}
                        data-bs-toggle="modal"
                        data-bs-target={`#${modal}`}
                      >
                        <FaPenAlt />
                      </button>

                      <button
                        className="btn btn-danger btn-sm ms-1 rounded-pill"
                        onClick={() => deleteHandler(item._id)}
                        disabled={deleteApi?.isLoading}
                      >
                        {deleteApi?.isLoading ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <span>
                            <FaTrash />
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Suppliers)), {
  ssr: false,
})
