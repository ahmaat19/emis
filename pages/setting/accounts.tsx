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
  dynamicInputSelect,
  inputNumber,
  inputText,
  inputTextArea,
  staticInputSelect,
} from '../../utils/dForms'
import FormView from '../../components/FormView'
import { FaCheckCircle, FaPenAlt, FaTimesCircle, FaTrash } from 'react-icons/fa'
import apiHook from '../../api'
import { IAccount } from '../../models/Account'
import { IAccountType } from '../../models/AccountType'

const Accounts = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const getAccountTypeApi = apiHook({
    key: ['account-types-api'],
    method: 'GET',
    url: `setting/account-types?page=${page}&q=${q}&limit=${100}`,
  })?.get

  const getApi = apiHook({
    key: ['accounts'],
    method: 'GET',
    url: `setting/accounts?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const postApi = apiHook({
    key: ['accounts'],
    method: 'POST',
    url: `setting/accounts`,
  })?.post

  const updateApi = apiHook({
    key: ['accounts'],
    method: 'PUT',
    url: `setting/accounts`,
  })?.put

  const deleteApi = apiHook({
    key: ['accounts'],
    method: 'DELETE',
    url: `setting/accounts`,
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

  const editHandler = (item: IAccount) => {
    setId(item._id)
    setValue('accNo', item?.accNo)
    setValue('name', item?.name)
    setValue('accountType', item?.accountType?._id)
    setValue('openingBalance', item?.openingBalance)
    setValue('description', item?.description)
    setValue('status', item?.status)

    setEdit(true)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Accounts List'
  const label = 'Account'
  const modal = 'account'

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
        label: 'Account Number',
        name: 'accNo',
        placeholder: 'Enter account number',
      } as DynamicFormProps)}
    </div>,
    <div key={1} className="col-md-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Name',
        name: 'name',
        placeholder: 'Enter name',
      } as DynamicFormProps)}
    </div>,
    <div key={2} className="col-md-6 col-12">
      {dynamicInputSelect({
        register,
        errors,
        label: 'Account Type',
        name: 'accountType',
        placeholder: 'Select account type',
        value: 'name',
        data: getAccountTypeApi?.data?.data?.filter(
          (acc: IAccountType) => acc?.status === 'active'
        ),
      } as DynamicFormProps)}
    </div>,
    <div key={3} className="col-md-6 col-12">
      {inputNumber({
        register,
        errors,
        label: 'Opening Balance',
        name: 'openingBalance',
        placeholder: 'Enter opening balance',
      } as DynamicFormProps)}
    </div>,
    <div key={4} className="col-12">
      {inputTextArea({
        register,
        errors,
        label: 'Description',
        name: 'description',
        placeholder: 'Enter description',
        isRequired: false,
      } as DynamicFormProps)}
    </div>,
    <div key={5} className="col-md-6 col-12">
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
      <Meta title="Accounts" />

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
                placeholder="Search by account name"
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Account No.</th>
                <th>Name</th>
                <th>Account Type</th>
                <th>Opening Balance</th>
                <th>Current Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IAccount, i: number) => (
                <tr key={i}>
                  <td>{item?.accNo}</td>
                  <td>{item?.name}</td>
                  <td>{item?.accountType?.name}</td>
                  <td>${item?.openingBalance?.toFixed(2)}</td>
                  <td>${999.99}</td>
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

export default dynamic(() => Promise.resolve(withAuth(Accounts)), {
  ssr: false,
})
