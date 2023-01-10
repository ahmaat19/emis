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
  inputEmail,
  inputNumber,
  inputText,
  staticInputSelect,
} from '../../utils/dForms'
import FormView from '../../components/FormView'
import {
  FaCheckCircle,
  FaPenAlt,
  FaTimesCircle,
  FaTrash,
  FaTrashRestoreAlt,
} from 'react-icons/fa'
import moment from 'moment'
import apiHook from '../../api'
import { IClient } from '../../models/Client'
import { hide } from '../../utils/access'

const Clients = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['clients'],
    method: 'GET',
    url: `clients?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const seedApi = apiHook({
    key: ['clients'],
    method: 'POST',
    url: `clients/seed`,
  })?.post

  const postApi = apiHook({
    key: ['clients'],
    method: 'POST',
    url: `clients`,
  })?.post

  const updateApi = apiHook({
    key: ['clients'],
    method: 'PUT',
    url: `clients`,
  })?.put

  const deleteApi = apiHook({
    key: ['clients'],
    method: 'DELETE',
    url: `clients`,
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

  const editHandler = (item: IClient) => {
    setId(item._id)

    setValue('name', item?.name)
    setValue('email', item?.email)
    setValue('mobile', item?.mobile)
    setValue('address', item?.address)
    setValue('database', item?.database)
    setValue('status', item?.status)
    setValue('clientCode', item?.clientCode)

    setEdit(true)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Clients List'
  const label = 'Client'
  const modal = 'client'

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
    <div key={0} className="col-lg-6 col-md-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Name',
        name: 'name',
        placeholder: 'Enter name',
      } as DynamicFormProps)}
    </div>,
    <div key={1} className="col-lg-6 col-md-6 col-12">
      {inputEmail({
        register,
        errors,
        label: 'Email',
        name: 'email',
        placeholder: 'Enter email address',
      } as DynamicFormProps)}
    </div>,
    <div key={2} className="col-lg-6 col-md-6 col-12">
      {inputNumber({
        register,
        errors,
        label: 'Mobile',
        name: 'mobile',
        placeholder: 'Enter mobile number',
      } as DynamicFormProps)}
    </div>,
    <div key={3} className="col-lg-6 col-md-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Address',
        name: 'address',
        placeholder: 'Enter address',
      } as DynamicFormProps)}
    </div>,
    <div key={4} className="col-lg-6 col-md-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Client Code',
        name: 'clientCode',
        placeholder: 'Enter client code',
      } as DynamicFormProps)}
    </div>,
    <div key={5} className="col-lg-6 col-md-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Database',
        name: 'database',
        placeholder: 'Enter database name',
      } as DynamicFormProps)}
    </div>,
    <div key={6} className="col-lg-6 col-md-6 col-12">
      {staticInputSelect({
        register,
        errors,
        label: 'Status',
        name: 'status',
        placeholder: 'Enter status',
        data: [{ name: 'active' }, { name: 'disabled' }],
      } as DynamicFormProps)}
    </div>,
  ]

  const modalSize = 'modal-md'

  const seedHandler = (item: IClient) => {
    seedApi?.mutateAsync(item)
  }

  return (
    <>
      <Meta title="Clients" />

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

      {seedApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been Created successfully.`}
        />
      )}
      {seedApi?.isError && <Message variant="danger" value={seedApi?.error} />}

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
                placeholder="Search by name"
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Database</th>
                <th>Client Code</th>
                <th>Status</th>
                <th>DateTime</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IClient, i: number) => (
                <tr key={i}>
                  <td>{item?.name}</td>
                  <td>{item?.email}</td>

                  <td>{item?.mobile}</td>
                  <td>{item?.database}</td>
                  <td>{item?.clientCode}</td>
                  <td>
                    {item?.status === 'active' ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaTimesCircle className="text-danger" />
                    )}
                  </td>

                  <td>{moment(item?.createdAt).format('lll')}</td>
                  <td>
                    {/* {hide(['SUPER_ADMIN']) && item?.database === 'masterdb' ? (
                      <span className="badge bg-danger">N/A</span>
                    ) : ( */}
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
                        className="btn btn-warning btn-sm rounded-pill mx-1"
                        onClick={() => seedHandler(item)}
                        disabled={seedApi?.isLoading}
                      >
                        {seedApi?.isLoading ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <span>
                            <FaTrashRestoreAlt />
                          </span>
                        )}
                      </button>

                      <button
                        className="btn btn-danger btn-sm rounded-pill"
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
                    {/* )} */}
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

export default dynamic(() => Promise.resolve(withAuth(Clients)), { ssr: false })
