import React, { useEffect, useState } from 'react'
import { FormContainer, Message, Meta } from '../../components'
import { useForm } from 'react-hook-form'
import {
  DynamicFormProps,
  inputFile,
  inputTel,
  inputText,
  inputTextArea,
} from '../../utils/dForms'
import Image from 'next/image'
import { Spinner } from '../../components'
import apiHook from '../../api'
import { IOrganization } from '../../models/Organization'

interface IOrganizationFormValueProps
  extends Omit<IOrganization, '_id' | 'user'> {
  password?: string
}

const OrganizationComponent = () => {
  const [file, setFile] = useState(null)
  const [fileLink, setFileLink] = useState(null)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const getApi = apiHook({
    key: ['organization'],
    method: 'GET',
    url: `organization`,
  })?.get
  const updateApi = apiHook({
    key: ['organization'],
    method: 'PUT',
    url: `organization`,
  })?.put
  const uploadApi = apiHook({
    key: ['upload'],
    method: 'POST',
    url: `upload?type=image`,
  })?.post

  useEffect(() => {
    if (updateApi?.isSuccess) {
      getApi?.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateApi?.isSuccess])

  useEffect(() => {
    setValue('name', !getApi?.isLoading ? getApi?.data?.name : '')
    setValue('address', !getApi?.isLoading ? getApi?.data?.address : '')
    setValue('mobile', !getApi?.isLoading ? getApi?.data?.mobile : '')
    setValue('details', !getApi?.isLoading ? getApi?.data?.details : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApi?.isLoading, setValue])

  const submitHandler = (data: IOrganizationFormValueProps) => {
    if (!file && !fileLink) {
      updateApi?.mutateAsync({
        _id: getApi?.data?._id,
        name: data?.name,
        address: data?.address,
        mobile: data?.mobile,
        details: data?.details,
      })
    } else {
      updateApi?.mutateAsync({
        ...data,
        _id: getApi?.data?._id,
        image: fileLink,
      })
    }
  }

  useEffect(() => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      uploadApi?.mutateAsync(formData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => {
    if (uploadApi?.isSuccess) {
      setFileLink(uploadApi?.data.filePaths?.[0]?.path)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadApi?.isSuccess])

  return (
    <FormContainer>
      <Meta title="Organization" />
      <h3 className="fw-light font-monospace text-center">
        Organization Details
      </h3>

      {updateApi?.isError && (
        <Message variant="danger" value={updateApi?.error} />
      )}

      {uploadApi?.isError && (
        <Message variant="danger" value={uploadApi?.error} />
      )}
      {getApi?.isError && <Message variant="danger" value={getApi?.error} />}
      {updateApi?.isSuccess && (
        <Message
          variant="success"
          value="Details has been updated successfully"
        />
      )}

      {getApi?.isLoading && <Spinner />}
      <form onSubmit={handleSubmit(submitHandler)}>
        {getApi?.data?.image && (
          <div className="text-center rounded-pill">
            <Image
              src={getApi?.data?.image}
              alt="avatar"
              width="100"
              height="100"
              style={{ objectFit: 'cover' }}
              className="rounded-pill"
            />
          </div>
        )}

        <div className="row">
          <div className="col-12">
            {inputText({
              register,
              errors,
              label: 'Name',
              name: 'name',
              placeholder: 'Name',
            } as DynamicFormProps)}
          </div>
          <div className="col-md-6 col-12">
            {inputText({
              register,
              errors,
              label: 'Address',
              name: 'address',
              placeholder: 'Address',
            } as DynamicFormProps)}
          </div>
          <div className="col-md-6 col-12">
            {inputTel({
              register,
              errors,
              label: 'Mobile',
              name: 'mobile',
              placeholder: '+252 (61) 530-1507',
            } as DynamicFormProps)}
          </div>
          <div className="col-12">
            {inputTextArea({
              register,
              errors,
              label: 'Details',
              name: 'details',
              placeholder: 'Tell us about your organization',
            } as DynamicFormProps)}
          </div>

          <div className="col-12">
            {inputFile({
              register,
              errors,
              label: 'Image',
              name: 'image',
              setFile,
              isRequired: false,
              placeholder: 'Choose an image',
            } as DynamicFormProps)}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary form-control"
          disabled={updateApi?.isLoading || uploadApi?.isLoading}
        >
          {updateApi?.isLoading || uploadApi?.isLoading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            'Update'
          )}
        </button>
      </form>
    </FormContainer>
  )
}

export default OrganizationComponent
