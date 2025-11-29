"use client";
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-views";
import { useCreateCredential, useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Credential } from "@prisma/client";   
import { formatDistanceToNow } from "date-fns";
import { CredentialType } from "@prisma/client";
import Image from "next/image";

export const CredentialsSearch = () => {
const [params, setParams] = useCredentialsParams();
const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });
    return (
        <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search credentials"
        />
    );
};




export const CredentialsList = () => {
    const credentials  = useSuspenseCredentials();

    return(
        <EntityList
        items={credentials.data.items}
        renderItem={(credential) => (
            <CredentialsItem data={credential} />
        )}
        getKey={(credential) => credential.id}
        emptyView={<CredentialsEmpty />}
        />
    )
};


export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {   
    return (
        <EntityHeader
        title="Credentials"
        description="Manage your credentials"
        newButtonHref="/credentials/new"
        newButtonLabel="New Credential"
        disabled={disabled}
        />
    );
};


export const CredentialsPagination = () => {
    const credentials = useSuspenseCredentials();
    const [params, setParams] = useCredentialsParams();


    return (
        <EntityPagination
         disabled={credentials.isFetching}
         totalPages={credentials.data.totalPages}
         page={credentials.data.page}
         onPageChange={(page) => setParams({ ...params, page })}
        />
    );
};


export const CredentialsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer 
            header={<CredentialsHeader />}
            search={<CredentialsSearch />}
            pagination={<CredentialsPagination />}
        >
            {children}
        </EntityContainer>
    )
};


export const CredentialsLoading = () => {
     return <LoadingView message="Loading credentials..."/>
};

export const CredentialsError = () => {
    return <ErrorView message="Error loading credentials"/>
};

export const CredentialsEmpty = () => {
    const router = useRouter();
    const handleCreate = () => {
        router.push(`/credentials/new`);
    }
    
    return (
          <EmptyView 
          onNew={handleCreate}
          message="you haven't created any credentials yet. Get started by creating a new credential."/>
    );
};


const credentialsIcons: Record<CredentialType, string> = {
    [CredentialType.GEMINI]: "/icons/gemini.svg",
    [CredentialType.ANTHROPIC]: "/icons/anthropic.svg",
    [CredentialType.OPENAI]: "/icons/openai.svg",
};

export const CredentialsItem = ({
    data,
}: {
    data:Credential
}) => {

  const removeCredential = useRemoveCredential();


  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };

  const icon = credentialsIcons[data.type] || "/icons/gemini.svg";

  return (
    <EntityItem
    href={`/credentials/${data.id}`}
    title={data.name}
    subtitle={
    <>
      Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
      &bull; Created
      {formatDistanceToNow(data.createdAt, { addSuffix: true })}
    </>}
    image={
        <div className="size-8 flex items-center justify-center">
            <Image 
            src={icon} 
            alt={data.type}
             width={20} 
             height={20} 
             />
        </div>
    }
    onRemove={handleRemove}
    isRemoving={removeCredential.isPending}
    />
  )
};